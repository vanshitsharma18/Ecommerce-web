const router = require('express').Router();
const { addItem, getCart, removeItem } = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/', auth, addItem);
router.get('/', auth, getCart);
router.delete('/:productId', auth, removeItem);

module.exports = router;
