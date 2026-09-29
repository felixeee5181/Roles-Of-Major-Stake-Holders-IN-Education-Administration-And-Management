require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'change-me-now';

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO users (username, password_hash, role)
             VALUES ($1, $2, 'admin')
             ON CONFLICT (username) DO NOTHING`,
            [username, hash]
        );
        console.log(`Admin user ready: ${username}`);
    } catch (err) {
        console.error('Seed error:', err.message);
    } finally {
        await pool.end();
    }
}

seed();
