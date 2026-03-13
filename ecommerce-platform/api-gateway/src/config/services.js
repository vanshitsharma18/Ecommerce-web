module.exports = {
  userService: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  productService: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
  cartService: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
  orderService: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  paymentService: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
};