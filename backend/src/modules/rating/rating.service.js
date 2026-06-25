import { query } from '../../config/db.config.js';

const getStoresForUser = async (userId, search = '') => {
    const sql = `
        SELECT s.id, s.name, s.address,
               COALESCE(AVG(r.rating), 0)::NUMERIC(10,1) as overall_rating,
               (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_submitted_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.name ILIKE $2 OR s.address ILIKE $2
        GROUP BY s.id
        ORDER BY s.name ASC
    `;
    const result = await query(sql, [userId, `%${search}%`]);
    return result.rows;
};

const upsertRating = async ({ userId, storeId, rating }) => {
    const sql = `
        INSERT INTO ratings (user_id, store_id, rating, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, store_id) 
        DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;
    const result = await query(sql, [userId, storeId, rating]);
    return result.rows[0];
};

const getUserRatingsLog = async (userId, { search = '', sortBy = 'loggedDate', order = 'DESC' }) => {
    let sanitizedSort = 'r.created_at';
    if (sortBy === 'scoreSubmitted') sanitizedSort = 'r.rating';
    else if (sortBy === 'storeName') sanitizedSort = 's.name';

    const sanitizedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sql = `
        SELECT r.id, s.name as "storeName", s.address as "storeAddress",
               r.rating as "scoreSubmitted", r.created_at as "loggedDate"
        FROM ratings r
        JOIN stores s ON r.store_id = s.id
        WHERE r.user_id = $1 AND (s.name ILIKE $2 OR s.address ILIKE $2)
        ORDER BY ${sanitizedSort} ${sanitizedOrder}
    `;
    const result = await query(sql, [userId, `%${search}%`]);
    return result.rows;
};

const ratingService = {
    getStoresForUser,
    upsertRating,
    getUserRatingsLog
};

export default ratingService;