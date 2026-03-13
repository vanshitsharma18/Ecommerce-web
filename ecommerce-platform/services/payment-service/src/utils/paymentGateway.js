// Fake payment gateway — always succeeds
const processPayment = async ({ orderId, amount }) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    transactionId: 'txn_' + Date.now(),
    orderId,
    amount,
    message: 'Payment successful (simulated)',
  };
};

module.exports = { processPayment };
