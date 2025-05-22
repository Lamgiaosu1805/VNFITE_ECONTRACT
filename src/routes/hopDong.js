const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const LoaiHopDongController = require('../controllers/LoaiHopDongController')
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
const { createLoaiHopDong } = require('../controllers/LoaiHopDongController');

router.post('/renderHDPreview', auth.verifyTokenPartner, upload.fields([
    { name: 'portrait', maxCount: 1 },
    { name: 'cccd_front', maxCount: 1 },
    { name: 'cccd_back', maxCount: 1 },
]), HopDongController.renderHD);
router.post('/kyHopDong', HopDongController.kyHopDong);
router.post('/validateOTP', HopDongController.validateOTP);
router.post('/renderHDPreview', auth.verifyTokenPartner, HopDongController.renderHD);
router.get('/chiTietHopHong/:templateId', auth.verifyTokenPartner, HopDongController.getChiTietHD);
router.post('/loaiHopDong', LoaiHopDongController.createLoaiHopDong);

module.exports = router;