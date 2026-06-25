import pkg from 'pg';
import envConfig from './env.config.js';

const { Pool } = pkg;

const pool = new Pool({
    user: envConfig.db.user,
    host: envConfig.db.host,
    database: envConfig.db.database,
    password: envConfig.db.password,
    port: envConfig.db.port,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const dbConnection = async () => {
    // Run a quick test query to confirm the database connection is live
    const client = await pool.connect();
    console.log(`✅ PostgreSQL Connected to database: ${envConfig.db.database}`);
    client.release(); // Return the client immediately back to the pool
};

// Export query method to prevent manual connection management across services
export const query = (text, params) => pool.query(text, params);