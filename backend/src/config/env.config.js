import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const envConfig = {
    PORT: process.env.PORT || 9000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    GOOGLE_USER_EMAIL: process.env.GOOGLE_USER_EMAIL,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        database: process.env.DB_DATABASE || 'store_rating_db',
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10),
    }
};

export default envConfig;
