const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
/**
 * load controller
 */
const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router;
