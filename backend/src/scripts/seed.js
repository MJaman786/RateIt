// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import bcrypt from 'bcrypt';
// import { query } from '../config/db.config.js';

// // Setup __dirname replacement for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const seedDatabase = async () => {
//     try {
//         console.log('✅ Dropping existing tables and types...');

//         await query(`
//             DROP TABLE IF EXISTS ratings CASCADE;
//             DROP TABLE IF EXISTS stores CASCADE;
//             DROP TABLE IF EXISTS users CASCADE;
//             DROP TYPE IF EXISTS account_status CASCADE;
//             DROP TYPE IF EXISTS user_role CASCADE;
//         `);

//         console.log('⏳ Reading schema.sql to ensure tables exist...');
//         const schemaPath = path.join(__dirname, '../schema.sql');
//         const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
        
//         console.log('⚙️ Executing database table schema definitions...');
//         // Executes the SQL commands to create types and tables if they don't exist
//         await query(sqlSchema);

//         console.log('🔐 Hashing default passwords...');
//         const securePassword = await bcrypt.hash('SecurePass123!', 12);

//         console.log('👤 Provisioning user roles with exact Joi length compliance...');
//         // System Admin (Name >= 20 characters)
//         const adminRes = await query(`
//             INSERT INTO users (name, email, password, address, role, is_email_verified)
//             VALUES ($1, $2, $3, $4, 'ADMIN', true) RETURNING id;
//         `, ['System Administrator Account', 'admin@platform.com', securePassword, 'Main Headquarters, Suite 101']);
        
//         // Store Owner (Name >= 20 characters)
//         const ownerRes = await query(`
//             INSERT INTO users (name, email, password, address, role, is_email_verified)
//             VALUES ($1, $2, $3, $4, 'STORE_OWNER', true) RETURNING id;
//         `, ['Business Owner Account Profile', 'owner@merchstore.com', securePassword, 'Commercial Complex Sector B']);

//         // Normal User (Name >= 20 characters)
//         const userRes = await query(`
//             INSERT INTO users (name, email, password, address, role, is_email_verified)
//             VALUES ($1, $2, $3, $4, 'USER', true) RETURNING id;
//         `, ['Standard Consumer Account Test', 'user@buyermail.com', securePassword, 'Residential Apartments Tower 4']);

//         const ownerId = ownerRes.rows[0].id;
//         const userId = userRes.rows[0].id;

//         console.log('🏪 Injecting sample Store registered profiles...');
//         const storeRes = await query(`
//             INSERT INTO stores (name, email, address, owner_id)
//             VALUES ($1, $2, $3, $4) RETURNING id;
//         `, ['The Premium Tech Corner', 'contact@premiumtech.com', 'Commercial Complex Sector B', ownerId]);

//         const storeId = storeRes.rows[0].id;

//         console.log('⭐ Injecting initial atomic store star ratings...');
//         await query(`
//             INSERT INTO ratings (rating, user_id, store_id)
//             VALUES ($1, $2, $3);
//         `, [5, userId, storeId]);

//         console.log('🚀 Database initialization and seeding finished flawlessly!');
//         process.exit(0);
//     } catch (error) {
//         console.error('❌ Database seeding halted with an error:', error);
//         process.exit(1);
//     }
// };

// seedDatabase();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { query } from '../config/db.config.js';

// Setup __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        console.log('✅ Dropping existing tables and types...');

        await query(`
            DROP TABLE IF EXISTS ratings CASCADE;
            DROP TABLE IF EXISTS stores CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TYPE IF EXISTS account_status CASCADE;
            DROP TYPE IF EXISTS user_role CASCADE;
        `);

        console.log('⏳ Reading schema.sql to ensure tables exist...');
        const schemaPath = path.join(__dirname, '../schema.sql');
        const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('⚙️ Executing database table schema definitions...');
        await query(sqlSchema);

        console.log('🔐 Hashing default passwords...');
        const securePassword = await bcrypt.hash('SecurePass123!', 12);

        console.log('👤 Provisioning user roles with exact Joi length compliance...');
        
        // 1. System Admin (1 Admin)
        await query(`
            INSERT INTO users (name, email, password, address, role, is_email_verified)
            VALUES ($1, $2, $3, $4, 'ADMIN', true) RETURNING id;
        `, ['System Administrator Account', 'admin@platform.com', securePassword, 'Main Headquarters, Suite 101']);
        
        // 2. Store Owners (10 Owners)
        const ownerIds = [];
        for (let i = 1; i <= 10; i++) {
            const ownerRes = await query(`
                INSERT INTO users (name, email, password, address, role, is_email_verified)
                VALUES ($1, $2, $3, $4, 'STORE_OWNER', true) RETURNING id;
            `, [
                `Business Owner Profile Space ${i.toString().padStart(2, '0')}`, // Safely > 20 characters
                `owner${i}@merchstore.com`, 
                securePassword, 
                `Commercial Complex Sector B, Unit ${i}`
            ]);
            ownerIds.push(ownerRes.rows[0].id);
        }
        console.log('   ↳ 10 Store Owners created successfully.');

        // 3. Normal Users (10 Users)
        const userIds = [];
        for (let i = 1; i <= 10; i++) {
            const userRes = await query(`
                INSERT INTO users (name, email, password, address, role, is_email_verified)
                VALUES ($1, $2, $3, $4, 'USER', true) RETURNING id;
            `, [
                `Standard Consumer Test User ${i.toString().padStart(2, '0')}`, // Safely > 20 characters
                `user${i}@buyermail.com`, 
                securePassword, 
                `Residential Apartments Tower 4, Apt ${i}`
            ]);
            userIds.push(userRes.rows[0].id);
        }
        console.log('   ↳ 10 Normal Users created successfully.');

        // Use the first generated IDs to link the sample store and rating records below
        const ownerId = ownerIds[0];
        const userId = userIds[0];

        console.log('🏪 Injecting sample Store registered profiles...');
        const storeRes = await query(`
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `, ['The Premium Tech Corner', 'contact@premiumtech.com', 'Commercial Complex Sector B', ownerId]);

        const storeId = storeRes.rows[0].id;

        console.log('⭐ Injecting initial atomic store star ratings...');
        await query(`
            INSERT INTO ratings (rating, user_id, store_id)
            VALUES ($1, $2, $3);
        `, [5, userId, storeId]);

        console.log('🚀 Database initialization and seeding finished flawlessly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database seeding halted with an error:', error);
        process.exit(1);
    }
};

seedDatabase();