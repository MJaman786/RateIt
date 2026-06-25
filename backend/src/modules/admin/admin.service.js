import { query } from '../../config/db.config.js';
import bcrypt from 'bcrypt';
import AppError from '../../common/AppError.js';

const getDashboardStats = async () => {
    const userCount = await query('SELECT COUNT(*) FROM users');
    const storeCount = await query('SELECT COUNT(*) FROM stores');
    const ratingCount = await query('SELECT COUNT(*) FROM ratings');

    return {
        totalUsers: parseInt(userCount.rows[0].count, 10),
        totalStores: parseInt(storeCount.rows[0].count, 10),
        totalRatings: parseInt(ratingCount.rows[0].count, 10)
    };
};

const createStore = async ({ name, email, address, ownerId }) => {
    const duplicate = await query('SELECT id FROM stores WHERE email = $1', [email.toLowerCase()]);
    if (duplicate.rows.length > 0) {
        throw new AppError('Store email already registered', 409);
    }

    const sql = `
        INSERT INTO stores (name, email, address, owner_id) 
        VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await query(sql, [name, email.toLowerCase(), address, ownerId]);
    return result.rows[0];
};

const createUser = async ({ name, email, password, address, role }) => {
    const duplicate = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (duplicate.rows.length > 0) {
        throw new AppError('Email already matches an existing user profile', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const sql = `
        INSERT INTO users (name, email, password, address, role, is_email_verified)
        VALUES ($1, $2, $3, $4, $5, true) RETURNING id, name, email, role, address
    `;
    const result = await query(sql, [name, email.toLowerCase(), hashedPassword, address, role]);
    return result.rows[0];
};

const getUserDetails = async (userId) => {
    // 1. Fetch user root info
    const userRes = await query('SELECT id, name, email, address, role, created_at FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) throw new AppError('User account profile not found', 404);

    let storeRating = null;

    // 2. Process special evaluation if target is a Store Owner 
    if (user.role === 'STORE_OWNER') {
        const ratingRes = await query(`
            SELECT COALESCE(AVG(r.rating), 0)::NUMERIC(10,1) as avg_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
        `, [user.id]);
        
        storeRating = ratingRes.rows[0] ? parseFloat(ratingRes.rows[0].avg_rating) : 0;
    }

    return {
        ...user,
        storeRating // Will be null unless role matches STORE_OWNER 
    };
};

const getAllUsers = async ({ search = '', role, sortBy = 'name', order = 'ASC' }) => {
    const validSortColumns = ['name', 'email', 'address', 'role'];
    const sanitizedSort = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const sanitizedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = `
        SELECT id, name, email, address, role, created_at 
        FROM users 
        WHERE (name ILIKE $1 OR email ILIKE $1 OR address ILIKE $1)
    `;
    const params = [`%${search}%`];

    if (role) {
        sql += ` AND role = $2`;
        params.push(role);
    }

    sql += ` ORDER BY ${sanitizedSort} ${sanitizedOrder}`;
    
    const result = await query(sql, params);
    return result.rows;
};

const getUnassignedOwners = async () => {
    const sql = `
        SELECT u.id as value, u.name as label
        FROM users u
        LEFT JOIN stores s ON u.id = s.owner_id
        WHERE u.role = 'STORE_OWNER' AND s.id IS NULL AND u.status = 'ACTIVE'
    `;
    const result = await query(sql);
    return result.rows;
};

// Update the existing getAllStores method inside backend/src/modules/admin/admin.service.js to matching field requirements:
const getAllStores = async ({ search = '', sortBy = 'name', order = 'ASC' }) => {
    const validSortColumns = ['name', 'email', 'address', 'rating'];
    const sanitizedSort = sortBy === 'rating' ? 'rating' : `s.${validSortColumns.includes(sortBy) ? sortBy : 'name'}`;
    const sanitizedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sql = `
        SELECT s.id, s.name, s.email, s.address, s.owner_id as "ownerId", u.name as "ownerName",
               COALESCE(AVG(r.rating), 0)::NUMERIC(10,1)::FLOAT as rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        LEFT JOIN users u ON s.owner_id = u.id
        WHERE s.name ILIKE $1 OR s.address ILIKE $1 OR s.email ILIKE $1
        GROUP BY s.id, u.id
        ORDER BY ${sanitizedSort} ${sanitizedOrder}
    `;
    const result = await query(sql, [`%${search}%`]);
    return result.rows;
};

const getAllRatings = async ({ search = '', rating, sortBy = 'submittedAt', order = 'DESC' }) => {
    const validSortColumns = ['submittedAt', 'ratingValue', 'userName', 'storeName'];
    let sanitizedSort = 'r.created_at';
    
    if (sortBy === 'ratingValue') sanitizedSort = 'r.rating';
    else if (sortBy === 'userName') sanitizedSort = 'u.name';
    else if (sortBy === 'storeName') sanitizedSort = 's.name';

    const sanitizedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const ratingFilter = rating === 'ALL' || !rating ? null : parseInt(rating, 10);

    let sql = `
        SELECT r.id, u.name as "userName", u.email as "userEmail", 
               s.name as "storeName", s.address as "storeAddress", 
               r.rating as "ratingValue", r.created_at as "submittedAt"
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        JOIN stores s ON r.store_id = s.id
        WHERE (u.name ILIKE $1 OR s.name ILIKE $1)
    `;
    const params = [`%${search}%`];

    if (ratingFilter) {
        sql += ` AND r.rating = $2`;
        params.push(ratingFilter);
    }

    sql += ` ORDER BY ${sanitizedSort} ${sanitizedOrder}`;
    const result = await query(sql, params);
    return result.rows;
};

const adminService = {
    getDashboardStats,
    createStore,
    createUser,
    getAllStores,
    getAllUsers,
    getUserDetails,
    getUnassignedOwners,
    getAllRatings
};

export default adminService;