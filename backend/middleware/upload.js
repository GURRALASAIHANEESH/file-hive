const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
}).single("image");

module.exports = uploadMiddleware;