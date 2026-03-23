const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../config/db");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require("../routes/authRoutes"));
app.use('/api/products', require("../routes/productRoutes"));
app.use('/api/orders', require("../routes/orderRoutes"));
app.use('/api/reviews', require("../routes/reviewRoutes"));
app.use('/api/users', require("../routes/userRoutes"));
app.use('/api/settings', require("../routes/settingsRoutes"));

// Export as serverless function
module.exports.handler = serverless(app);