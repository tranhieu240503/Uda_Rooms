const express = require("express");
const {
  updateUser,
  getCurrentUser,
  getUserById,
  upload, uploadAvatar
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Lấy thông tin người dùng hiện tại (từ token)
router.get("/", verifyToken, getCurrentUser);

// Lấy thông tin người dùng theo ID
router.get("/:id", verifyToken, getUserById);

// Cập nhật thông tin người dùng
router.put("/update", verifyToken, updateUser);
router.put("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);


module.exports = router;
