// api/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../server/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route for root
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Other routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/products', require('../server/routes/productRoutes'));
app.use('/api/orders', require('../server/routes/orderRoutes'));
app.use('/api/reviews', require('../server/routes/reviewRoutes'));
app.use('/api/users', require('../server/routes/userRoutes'));
app.use('/api/settings', require('../server/routes/settingsRoutes'));

// Export for Vercel serverless
module.exports = app;
module.exports.config = { api: { bodyParser: true } };