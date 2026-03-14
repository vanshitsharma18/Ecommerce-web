module.exports = {
  userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  cartService: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
};