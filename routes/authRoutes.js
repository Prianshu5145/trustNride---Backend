const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, approveDealer } = require('../controllers/authController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to register a new user (dealer or buyer)
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to request a password reset
router.post('/forgot-password', forgotPassword);

// Route to reset the password using the reset token
router.post('/reset-password', resetPassword);

// Route for admin to approve a dealer
router.patch('/approve-dealer/:id', isAuthenticated, authorizeRoles('admin'), approveDealer);

module.exports = router;
