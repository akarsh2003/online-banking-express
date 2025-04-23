const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware'); // If authentication is required
const roleCheck = require('../middleware/roleCheck');

// Make sure the controller functions are passed correctly
router.post('/create', authMiddleware, accountController.createAccount); 
router.get('/my-accounts', authMiddleware, accountController.getMyAccounts); 
router.get('/all-accounts', authMiddleware, roleCheck('admin'), accountController.getAllUserAccounts); 
router.post('/approve/:id', authMiddleware, roleCheck('admin'), accountController.approveAccount); 

module.exports = router;
