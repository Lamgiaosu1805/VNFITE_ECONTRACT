const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const LoaiHopDongController = require('../controllers/LoaiHopDongController')
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
 
router.post('/renderHDPreview', auth.verifyTokenPartner, upload.fields([
    { name: 'portrait', maxCount: 1 },
    { name: 'cccd_front', maxCount: 1 },
    { name: 'cccd_back', maxCount: 1 },
]), HopDongController.renderHD);
router.post('/kyHopDong', auth.verifyTokenPartner, HopDongController.kyHopDong);
router.post('/validateOTP', auth.verifyTokenPartner, HopDongController.validateOTP);
router.post('/renderHDPreview', auth.verifyTokenPartner, HopDongController.renderHD);
router.get('/chiTietHopHong/:templateId', auth.verifyTokenPartner, HopDongController.getChiTietHD);
router.post('/createLoaiHopDong', ipFilterMiddleware, LoaiHopDongController.createLoaiHopDong);
router.get('/taiHopDong', auth.verifyTokenPartner, HopDongController.taiHopDong);
router.post('/showHopDong', auth.verifyTokenPartner, HopDongController.showHopDong);

module.exports = router;