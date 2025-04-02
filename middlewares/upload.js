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

const resizeImage = async (filePath) => {
    try {
        // Đảm bảo filePath là đường dẫn tuyệt đối
        filePath = path.resolve(filePath);
        const compressedPath = filePath.replace(/(\.\w+)$/, "_compressed$1");

        // Log để debug
        console.log(`📂 Đường dẫn file gốc: ${filePath}`);
        console.log(`📂 Đường dẫn file nén: ${compressedPath}`);

        // Kiểm tra file gốc có tồn tại không
        if (!(await fs.access(filePath).then(() => true).catch(() => false))) {
            throw new Error(`File gốc không tồn tại: ${filePath}`);
        }

        // Nén ảnh bằng sharp
        await sharp(filePath)
            .resize({ width: 800, height: 800, withoutEnlargement: true })
            .jpeg({ quality: 60 })
            .toFile(compressedPath);

        console.log(`✅ Ảnh đã nén thành công: ${compressedPath}`);

        // Kiểm tra file nén có được tạo không
        if (!(await fs.access(compressedPath).then(() => true).catch(() => false))) {
            throw new Error(`File nén không được tạo: ${compressedPath}`);
        }

        // Chờ 1 giây trước khi xóa file gốc để tránh file bị khóa
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Xóa file gốc
        try {
            if (await fs.access(filePath).then(() => true).catch(() => false)) {
                await fs.unlink(filePath);
                console.log(`🗑 Ảnh gốc đã xóa: ${filePath}`);
            } else {
                console.log(`⚠ File gốc không còn tồn tại: ${filePath}`);
            }
        } catch (err) {
            console.error(`❌ Không thể xóa ảnh gốc: ${err.message}`);
            throw err; // Ném lỗi để middleware biết có vấn đề
        }

        return compressedPath;
    } catch (error) {
        console.error(`🚨 Lỗi xử lý ảnh: ${error.message}`);
        return filePath; // Trả về file gốc nếu có lỗi
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
