const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', require('./routes/paymentRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'payment-service',
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});

module.exports = app;
