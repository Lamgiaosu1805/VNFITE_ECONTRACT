const sharp = require('sharp');

/**
 * Middleware để chuyển tất cả các file ảnh sang định dạng JPG.
 * Áp dụng sau khi multer lưu trữ file vào bộ nhớ.
 */
const convertToJpg = async (req, res, next) => {
    if (!req.files) return next();

    const fileFields = Object.keys(req.files);
    
    for (const field of fileFields) {
        const fileArray = req.files[field];
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const jpgBuffer = await sharp(file.buffer)
                .jpeg()
                .toBuffer();

            // Ghi đè lại file bằng phiên bản JPG
            file.buffer = jpgBuffer;
            file.mimetype = 'image/jpeg';
            file.originalname = file.originalname.replace(/\.(png|webp|heic|heif|bmp|tiff?)$/i, '.jpg');
        }
    }

    next();
};

module.exports = convertToJpg;