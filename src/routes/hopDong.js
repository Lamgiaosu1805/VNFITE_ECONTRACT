const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router()

router.post('/renderHDPreview', auth.verifyTokenPartner, upload.fields([
    { name: 'portrait', maxCount: 1 },
    { name: 'cccd_front', maxCount: 1 },
    { name: 'cccd_back', maxCount: 1 },
]), HopDongController.renderHD);
router.post('/kyHopDong', HopDongController.kyHopDong);
router.post('/validateOTP', HopDongController.validateOTP);
router.get('/chiTietHopHong/:templateId', auth.verifyTokenPartner, HopDongController.getChiTietHD);

module.exports = router;