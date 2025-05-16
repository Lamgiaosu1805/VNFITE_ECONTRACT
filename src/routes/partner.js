const express = require('express');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const PartnerController = require('../controllers/PartnerController');
const router = express.Router()

router.post('/createPartner', ipFilterMiddleware, PartnerController.createPartner);

module.exports = router;