const express = require('express');
const HopDongController = require('../controllers/HopDongController');
const router = express.Router()

router.post('/renderHDPreview', HopDongController.renderChiTietHD);

module.exports = router;