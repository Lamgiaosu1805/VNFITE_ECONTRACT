// upload.middleware.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      console.log('>> Định dạng MIME:', file.mimetype);
      console.log('>> Tên file:', file.originalname);
  
      // Cho phép file bất kỳ (hoặc lọc định dạng ở đây)
      cb(null, true);
    },
});

module.exports = upload; // Export đúng ở đây