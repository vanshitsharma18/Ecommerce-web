const express = require('express');
const cors = require('cors');
require('dotenv').config();
const setupRoutes = require('./routes/gatewayRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Setup proxy routes
setupRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

module.exports = app;
