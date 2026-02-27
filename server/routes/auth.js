const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if user exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        await pool.query(
            'INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)',
            [username, email, phone || null, hashedPassword]
        );

        res.status(201).json({ message: 'Register success' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Using either username or email as login identifier
        const identifier = username || email;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Username/email and password are required' });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
