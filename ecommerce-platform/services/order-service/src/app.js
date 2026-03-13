const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'order-service',
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

module.exports = app;
