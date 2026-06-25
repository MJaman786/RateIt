import { query } from '../../config/db.config.js';
import AppError from '../../common/AppError.js';

const getOwnedStore = async (ownerId) => {
    const storeRes = await query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);
    const store = storeRes.rows[0];

    if (!store) {
        throw new AppError('No store registered under this management profile', 404);
    }

    return store;
};

const getOwnerDashboardInfo = async (ownerId) => {
    const store = await getOwnedStore(ownerId);

    const aggregateRes = await query(
        'SELECT COALESCE(AVG(rating), 0)::NUMERIC(10,1) as avg_rating, COUNT(*)::INT as total_ratings FROM ratings WHERE store_id = $1',
        [store.id]
    );

    const reviewersRes = await query(`
        SELECT r.id as rating_id, r.rating, r.created_at, u.name as reviewer_name, u.email as reviewer_email
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.created_at DESC
    `, [store.id]);

    return {
        storeName: store.name,
        averageRating: parseFloat(aggregateRes.rows[0].avg_rating),
        reviewersCount: parseInt(aggregateRes.rows[0].total_ratings, 10),
        reviews: reviewersRes.rows
    };
};

const getOwnerStoreRatings = async (ownerId, { search = '', rating, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10 } = {}) => {
    const store = await getOwnedStore(ownerId);

    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (safePage - 1) * safeLimit;
    const searchTerm = search.trim();
    const ratingFilter = rating === undefined || rating === null || rating === '' || rating === 'ALL'
        ? null
        : Number.parseInt(rating, 10);

    if (ratingFilter !== null && (!Number.isInteger(ratingFilter) || ratingFilter < 1 || ratingFilter > 5)) {
        throw new AppError('Rating filter must be between 1 and 5', 400);
    }

    const sortableColumns = {
        createdAt: 'r.created_at',
        rating: 'r.rating',
        userName: 'u.name',
        userEmail: 'u.email'
    };
    const sortColumn = sortableColumns[sortBy] ?? sortableColumns.createdAt;
    const sortDirection = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const searchParam = `%${searchTerm}%`;

    const countRes = await query(
        `
            SELECT COUNT(*)::INT AS total_items
            FROM ratings r
            JOIN users u ON u.id = r.user_id
            WHERE r.store_id = $1
              AND ($2 = '' OR u.name ILIKE $2 OR u.email ILIKE $2 OR u.address ILIKE $2)
              AND ($3::INT IS NULL OR r.rating = $3::INT)
        `,
        [store.id, searchParam, ratingFilter]
    );

    const ratingsRes = await query(
        `
            SELECT
                r.id AS rating_id,
                r.rating,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.address AS user_address
            FROM ratings r
            JOIN users u ON u.id = r.user_id
            WHERE r.store_id = $1
              AND ($2 = '' OR u.name ILIKE $2 OR u.email ILIKE $2 OR u.address ILIKE $2)
              AND ($3::INT IS NULL OR r.rating = $3::INT)
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT $4 OFFSET $5
        `,
        [store.id, searchParam, ratingFilter, safeLimit, offset]
    );

    const totalItems = parseInt(countRes.rows[0].total_items, 10);
    const totalPages = Math.max(Math.ceil(totalItems / safeLimit), 1);

    return {
        storeName: store.name,
        totalRatings: totalItems,
        page: safePage,
        limit: safeLimit,
        totalPages,
        ratings: ratingsRes.rows.map((row) => ({
            ratingId: row.rating_id,
            rating: row.rating,
            createdAt: row.created_at,
            user: {
                id: row.user_id,
                name: row.user_name,
                email: row.user_email,
                address: row.user_address
            }
        }))
    };
};

const ownerService = {
    getOwnerDashboardInfo,
    getOwnerStoreRatings
};

export default ownerService;
