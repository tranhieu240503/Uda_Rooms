const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Tạo thư mục lưu ảnh nếu chưa có
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file với Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadSingle = multer({ storage }).single("image");
const uploadMultiple = multer({ storage }).array("images", 5); // Tối đa 5 ảnh

// Hàm resize ảnh (đảm bảo giảm dung lượng tốt)
const resizeImage = async (filePath) => {
    try {
        const compressedPath = filePath.replace(/(\.\w+)$/, "_compressed$1"); // Thêm "_compressed" vào tên file

        const buffer = await sharp(filePath)
            .resize({ width: 800, height:800 ,withoutEnlargement: true}) // Resize chiều rộng tối đa 800px
            .jpeg({ quality: 60 }) // Giảm chất lượng xuống 60%
            .toBuffer();

        fs.writeFileSync(compressedPath, buffer); // Ghi file mới

        // Xóa ảnh gốc sau khi resize thành công
        fs.unlinkSync(filePath);

        return compressedPath; // Trả về đường dẫn ảnh mới
    } catch (error) {
        console.error("Lỗi xử lý ảnh:", error);
        return null;
    }
};


// Middleware resize ảnh sau khi upload
const processImage = async (req, res, next) => {
    if (req.file) {
        const newPath = await resizeImage(req.file.path);
        if (newPath) {
            req.file.path = newPath; // Cập nhật đường dẫn file mới vào req
            req.file.filename = path.basename(newPath); // Cập nhật tên file mới
        }
    }
    next();
};

const processMultipleImages = async (req, res, next) => {
    if (req.files && req.files.length > 0) {
        req.files = await Promise.all(
            req.files.map(async (file) => {
                const newPath = await resizeImage(file.path);
                if (newPath) {
                    file.path = newPath;
                    file.filename = path.basename(newPath);
                }
                return file;
            })
        );
    }
    next();
};


module.exports = {
    uploadSingle,
    uploadMultiple,
    processImage,
    processMultipleImages,
};
