const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', require('./routes/cartRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'cart-service',
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});

module.exports = app;
