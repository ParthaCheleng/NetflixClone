const pool = require('./connection');

async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to Aiven MySQL successfully!');

        // Create users table if not exists
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await connection.query(createTableQuery);
        console.log('Users table ensured in database.');

        connection.release();
    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
}

module.exports = initDB;
