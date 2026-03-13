const router = require('express').Router();
const { addProduct, getAllProducts, getProduct, deleteAll } = require('../controllers/productController');

router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.delete('/', deleteAll);

module.exports = router;
