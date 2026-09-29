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

        // ============================================================
        // 1. SYSTEM ADMIN
        // Exactly ONE ADMIN account
        // ============================================================

        await query(`
            INSERT INTO users (
                name,
                email,
                password,
                address,
                role,
                is_email_verified
            )
            VALUES ($1, $2, $3, $4, 'ADMIN', true)
            RETURNING id;
        `, [
            'System Administrator Account',
            'admin@platform.com',
            securePassword,
            'Main Headquarters, Suite 101'
        ]);

        console.log('   ↳ 1 Admin created successfully.');

        // ============================================================
        // 2. STORE OWNERS
        // 10 STORE_OWNER accounts
        // ============================================================

        const ownerIds = [];

        for (let i = 1; i <= 10; i++) {
            const ownerRes = await query(`
                INSERT INTO users (
                    name,
                    email,
                    password,
                    address,
                    role,
                    is_email_verified
                )
                VALUES ($1, $2, $3, $4, 'STORE_OWNER', true)
                RETURNING id;
            `, [
                `Business Owner Profile Space ${i.toString().padStart(2, '0')}`,
                `owner${i}@merchstore.com`,
                securePassword,
                `Commercial Complex Sector B, Unit ${i}`
            ]);

            ownerIds.push(ownerRes.rows[0].id);
        }

        console.log('   ↳ 10 Store Owners created successfully.');

        // ============================================================
        // 3. NORMAL USERS
        // 10 USER accounts
        // ============================================================

        const userIds = [];

        for (let i = 1; i <= 10; i++) {
            const userRes = await query(`
                INSERT INTO users (
                    name,
                    email,
                    password,
                    address,
                    role,
                    is_email_verified
                )
                VALUES ($1, $2, $3, $4, 'USER', true)
                RETURNING id;
            `, [
                `Standard Consumer Test User ${i.toString().padStart(2, '0')}`,
                `user${i}@buyermail.com`,
                securePassword,
                `Residential Apartments Tower 4, Apt ${i}`
            ]);

            userIds.push(userRes.rows[0].id);
        }

        console.log('   ↳ 10 Normal Users created successfully.');

        // ============================================================
        // 4. STORES
        // 10 STORES
        // Each store is linked to one Store Owner
        // ============================================================

        const stores = [
            {
                name: 'The Premium Tech Corner',
                email: 'contact@premiumtech.com',
                address: 'Commercial Complex Sector B, Shop 101'
            },
            {
                name: 'Urban Fashion Collection',
                email: 'contact@urbanfashion.com',
                address: 'City Center Mall, Shop 202'
            },
            {
                name: 'Fresh Mart Grocery Store',
                email: 'contact@freshmart.com',
                address: 'Green Valley Market, Shop 303'
            },
            {
                name: 'Home Decor Lifestyle Store',
                email: 'contact@homedecor.com',
                address: 'Sunrise Commercial Plaza, Shop 404'
            },
            {
                name: 'Elite Sports Equipment Store',
                email: 'contact@elitesports.com',
                address: 'Downtown Sports Complex, Shop 505'
            },
            {
                name: 'Book Haven Knowledge Store',
                email: 'contact@bookhaven.com',
                address: 'Central Library Road, Shop 606'
            },
            {
                name: 'Gourmet Kitchen Essentials',
                email: 'contact@gourmetkitchen.com',
                address: 'Food Street Commercial Area, Shop 707'
            },
            {
                name: 'Smart Gadgets World Store',
                email: 'contact@smartgadgets.com',
                address: 'Tech Park Shopping Center, Shop 808'
            },
            {
                name: 'Beauty Care Essentials Store',
                email: 'contact@beautycare.com',
                address: 'Rose Garden Shopping Plaza, Shop 909'
            },
            {
                name: 'Modern Furniture Gallery',
                email: 'contact@modernfurniture.com',
                address: 'Industrial Estate Main Road, Shop 1001'
            }
        ];

        const storeIds = [];

        for (let i = 0; i < stores.length; i++) {
            const store = stores[i];

            const storeRes = await query(`
                INSERT INTO stores (
                    name,
                    email,
                    address,
                    owner_id
                )
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `, [
                store.name,
                store.email,
                store.address,
                ownerIds[i]
            ]);

            storeIds.push(storeRes.rows[0].id);
        }

        console.log('   ↳ 10 Stores created successfully.');

        // ============================================================
        // 5. RATINGS
        // Create dummy ratings using the 10 normal users
        // ============================================================

        console.log('⭐ Injecting initial atomic store star ratings...');

        const ratings = [
            [5, userIds[0], storeIds[0]],
            [4, userIds[1], storeIds[1]],
            [5, userIds[2], storeIds[2]],
            [4, userIds[3], storeIds[3]],
            [5, userIds[4], storeIds[4]],
            [3, userIds[5], storeIds[5]],
            [4, userIds[6], storeIds[6]],
            [5, userIds[7], storeIds[7]],
            [4, userIds[8], storeIds[8]],
            [5, userIds[9], storeIds[9]]
        ];

        for (const [rating, userId, storeId] of ratings) {
            await query(`
                INSERT INTO ratings (
                    rating,
                    user_id,
                    store_id
                )
                VALUES ($1, $2, $3);
            `, [
                rating,
                userId,
                storeId
            ]);
        }

        console.log('   ↳ 10 Store ratings created successfully.');

        // ============================================================
        // FINISHED
        // ============================================================

        console.log('');
        console.log('==============================================');
        console.log('🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY');
        console.log('==============================================');
        console.log('👑 Admins       : 1');
        console.log('🏪 Store Owners : 10');
        console.log('👤 Normal Users : 10');
        console.log('🏬 Stores       : 10');
        console.log('⭐ Ratings      : 10');
        console.log('==============================================');
        console.log('🔑 Default Password: SecurePass123!');
        console.log('==============================================');

        process.exit(0);

    } catch (error) {
        console.error('❌ Database seeding halted with an error:', error);
        process.exit(1);
    }
};

seedDatabase();