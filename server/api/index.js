// api/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../server/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/products', require('../server/routes/productRoutes'));
app.use('/api/orders', require('../server/routes/orderRoutes'));
app.use('/api/reviews', require('../server/routes/reviewRoutes'));
app.use('/api/users', require('../server/routes/userRoutes'));
app.use('/api/settings', require('../server/routes/settingsRoutes'));

// Vercel serverless export
module.exports = app;
module.exports.config = {
  api: {
    bodyParser: true,
  },
};