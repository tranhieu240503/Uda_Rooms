const bcrypt = require("bcryptjs");
const Users = require("../models/Users"); // Import model Users
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


// Cập nhật thông tin người dùng

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { fullname, password, phone, gender } = req.body;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Cập nhật thông tin
    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    // Tạo token mới với thông tin mới
    const newToken = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Cập nhật thành công!", token: newToken });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};


// Lấy thông tin người dùng hiện tại
const getCurrentUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ["id", "email", "fullname", "avatar", "phone", "gender"],
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.set("Cache-Control", "no-store"); // Ngăn trình duyệt lưu cache
    res.json({ user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.params.id },
      attributes: ["id", "email", "fullname", "avatar", "phone", "gender"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.set("Cache-Control", "no-store"); // Ngăn trình duyệt lưu cache
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

// Cấu hình multer để upload ảnh
const upload = multer({
  storage: multer.memoryStorage(), // Lưu vào RAM trước khi xử lý
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ chấp nhận file ảnh JPG, JPEG, PNG"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn file 2MB
});

// Hàm xử lý upload và nén ảnh
const uploadAvatar = async (req, res) => {
  const { id } = req.user;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng chọn ảnh" });
    }

    const uploadDir = path.join(__dirname, "../upload_avataruser");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `user_${id}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    await sharp(req.file.buffer)
      .resize(300, 300)
      .jpeg({ quality: 70 })
      .toFile(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Lỗi khi lưu file ảnh" });
    }

    await Users.update({ avatar: `${fileName}` }, { where: { id } });

    const updatedUser = await Users.findByPk(id);

    // Tạo token mới với avatar mới
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        fullname: updatedUser.fullname,
        avatar: updatedUser.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Avatar cập nhật thành công!",
      avatar: updatedUser.avatar,
      token: newToken,
    });
  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    return res.status(500).json({ error: "Lỗi hệ thống khi upload ảnh" });
  }
};


module.exports = {
  updateUser,
  getCurrentUser,
  getUserById,
  upload,
  uploadAvatar,
};
