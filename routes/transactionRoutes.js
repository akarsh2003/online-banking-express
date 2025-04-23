const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.post('/send', auth, transactionController.sendMoney);
router.get('/history', auth, transactionController.getMyTransactions);

module.exports = router;
