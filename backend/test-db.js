const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        const [tables] = await pool.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        
        for (const tableName of tableNames) {
            console.log(`--- ${tableName} ---`);
            const [columns] = await pool.query(`DESCRIBE ${tableName}`);
            console.log(columns.map(c => c.Field).join(', '));
        }

        await pool.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

testConnection();
