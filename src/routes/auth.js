const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router()

router.post('/getTokenPartner', AuthController.getTokenPartner);

module.exports = router;