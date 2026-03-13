const { createProxyMiddleware } = require('http-proxy-middleware');
const { requireAuth } = require('../middleware/authMiddleware');
const services = require('../config/services');

module.exports = (app) => {

  app.use('/api/users', createProxyMiddleware({
    target: services.userService,
    changeOrigin: true
  }));

  app.use('/api/products', createProxyMiddleware({
    target: services.productService,
    changeOrigin: true
  }));

  app.use('/api/cart',
    requireAuth,
    createProxyMiddleware({
      target: services.cartService,
      changeOrigin: true
    })
  );

  app.use('/api/orders',
    requireAuth,
    createProxyMiddleware({
      target: services.orderService,
      changeOrigin: true
    })
  );

  app.use('/api/payment',
    requireAuth,
    createProxyMiddleware({
      target: services.paymentService,
      changeOrigin: true
    })
  );

};