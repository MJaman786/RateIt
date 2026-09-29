import pkg from 'pg';
import envConfig from './env.config.js';

const { Pool } = pkg;

const poolConfig = envConfig.db.connectionString
    ? {
          connectionString: envConfig.db.connectionString,
          ssl: { rejectUnauthorized: false }
      }
    : {
          user: envConfig.db.user,
          host: envConfig.db.host,
          database: envConfig.db.database,
          password: envConfig.db.password,
          port: envConfig.db.port,
          // Neon requires SSL. Setting rejectUnauthorized to false helps avoid cert issues
          ssl: { rejectUnauthorized: false }
      };

const pool = new Pool(poolConfig);

export const dbConnection = async () => {
    // Run a quick test query to confirm the database connection is live
    const client = await pool.connect();
    console.log(`✅ PostgreSQL Connected to database: ${envConfig.db.database}`);
    client.release(); // Return the client immediately back to the pool
};

// Export query method to prevent manual connection management across services
export const query = (text, params) => pool.query(text, params);