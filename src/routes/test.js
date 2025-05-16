const express = require('express');
const TestController = require('../controllers/TestController');
const auth = require('../middlewares/auth');
const ipFilterMiddleware = require('../middlewares/ipWhitelist');
const router = express.Router()

router.get('/', TestController.index);
router.get('/getTokenUserVNPT', ipFilterMiddleware, TestController.getTokenUserVNPT);
router.get('/getTokenThirdPartyVNPT', ipFilterMiddleware, TestController.getTokenThirdPartyVNPT);
router.post('/ssoCallback', ipFilterMiddleware, auth.verifyToken, TestController.ssoCallback);

module.exports = router;