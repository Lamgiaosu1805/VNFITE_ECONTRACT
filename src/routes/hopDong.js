const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const router = express.Router();
const LoaiHopDongController = require('../controllers/LoaiHopDongController')
const { createLoaiHopDong } = require('../controllers/LoaiHopDongController');
router.post('/renderHDPreview', auth.verifyTokenPartner, HopDongController.renderHD);
router.get('/chiTietHopHong/:templateId', auth.verifyTokenPartner, HopDongController.getChiTietHD);
router.post('/loaiHopDong', LoaiHopDongController.createLoaiHopDong);
module.exports = router;