const router = require('express').Router();
const { pay } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/', auth, pay);

module.exports = router;
