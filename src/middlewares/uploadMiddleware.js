// upload.middleware.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload; // Export đúng ở đây