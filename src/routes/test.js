const express = require('express');
const TestController = require('../controllers/TestController');
const auth = require('../middlewares/auth');
const router = express.Router()

router.get('/', TestController.index);
router.get('/getTokenUserVNPT', TestController.getTokenUserVNPT);
router.get('/getTokenThirdPartyVNPT', TestController.getTokenThirdPartyVNPT);
router.post('/ssoCallback', auth.verifyToken, TestController.ssoCallback);

module.exports = router;