const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Register
router.post('/register', validateRegistration, userController.register);

// Login
router.post('/login', validateLogin, userController.login);

// Profile
router.get('/profile', auth, userController.getProfile);

module.exports = router;