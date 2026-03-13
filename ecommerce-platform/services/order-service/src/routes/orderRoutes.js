const router = require('express').Router();
const { createOrder, getUserOrders, getOrder, updateStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/:id', auth, getOrder);
router.patch('/:id/status', auth, updateStatus);

module.exports = router;
