const { processPayment } = require('../utils/paymentGateway');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';

// Process payment and update order status
exports.pay = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'orderId and amount are required' });
    }

    // Simulate payment
    const result = await processPayment({ orderId, amount });

    if (!result.success) {
      return res.status(400).json({ message: 'Payment failed' });
    }

    // Update order status to confirmed via order-service
    try {
      const token = req.headers.authorization;
      await fetch(`${ORDER_SERVICE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ status: 'confirmed' }),
      });
    } catch (err) {
      console.error('Failed to update order status:', err.message);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
