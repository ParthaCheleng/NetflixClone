require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const initDB = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies

// Initialize DB and ensure tables exist
initDB();

// Routes
app.use('/api/auth', authRoutes);

// Protected health check route for demo purposes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is running normally' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
