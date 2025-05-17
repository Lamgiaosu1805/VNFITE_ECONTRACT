const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const router = express.Router()

router.post('/renderHDPreview', auth.verifyTokenPartner, HopDongController.renderHD);
router.get('/chiTietHopHong/:templateId', auth.verifyTokenPartner, HopDongController.getChiTietHD);

module.exports = router;