import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up the database by running the seed.sql file if needed.
 * Checks if faculty table has data - if not, runs a full re-seed.
 */
// const setupDatabase = async () => {
//     /**
//      * Check if faculty table has any rows and wrap in try-catch to handle cases
//      * where table doesn't exist yet.
//      */
//     let hasData = false;
//     try {
//         const result = await db.query(`
//             SELECT EXISTS (
//                 SELECT 1 FROM information_schema.tables 
//                 WHERE table_name = 'contact_form'
//             ) as has_table
//         `);
//         hasData = result.rows[0]?.has_table || false;
//     } catch (error) {
//         /**
//          * If query fails (e.g., table doesn't exist), treat the same as no data.
//          * This allows the seed process to proceed.
//          */
//         hasData = false;
//     }
    
//     if (hasData) {
//         console.log('Database already seeded');
//         return true;
//     }
    
//     // No faculty found - run full seed
//     console.log('Seeding database...');
//     const seedPath = join(__dirname, 'sql', 'seed.sql');
//     const seedSQL = fs.readFileSync(seedPath, 'utf8');
//     await db.query(seedSQL);
//     // Run practice.sql if it exists (for student assignments)
//     const practicePath = join(__dirname, 'sql', 'practice.sql');
//     if (fs.existsSync(practicePath)) {
//         const practiceSQL = fs.readFileSync(practicePath, 'utf8');
//         await db.query(practiceSQL);
//         console.log('Practice database tables initialized');
//     }
//     console.log('Database seeded successfully');
    
//     return true;
// };

const setupDatabase = async () => {
    try {
        // 1. Create a tracking table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS schema_history (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const sqlFiles = ['seed.sql', 'practice.sql'];

        for (const filename of sqlFiles) {
            const filePath = join(__dirname, 'sql', filename);
            if (!fs.existsSync(filePath)) continue;

            // Check if this specific file has been run before
            const check = await db.query('SELECT 1 FROM schema_history WHERE filename = $1', [filename]);
            
            if (check.rows.length === 0) {
                console.log(`Executing missing script: ${filename}...`);
                const sqlContent = fs.readFileSync(filePath, 'utf8');
                
                // Run the SQL script
                await db.query(sqlContent);
                
                // Record that we ran it so we never run it again
                await db.query('INSERT INTO schema_history (filename) VALUES ($1)', [filename]);
            }
        }

        console.log('Database schema check complete.');
        return true;
    } catch (error) {
        console.error('Database tracking setup failed:', error);
        return false;
    }
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };