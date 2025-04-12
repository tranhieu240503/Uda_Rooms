const express = require("express");
const {
  updateUserByAdmin,
  updateUser,
  getCurrentUser,
  getUserById,
  upload,
  uploadAvatar,
  getAllUsers, // Thêm hàm mới
  deleteUser,  // Thêm hàm xóa người dùng
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Lấy thông tin người dùng hiện tại (từ token)
router.get("/", verifyToken, getCurrentUser);

// Lấy thông tin người dùng theo ID
router.get("/:id", verifyToken, getUserById);

// Cập nhật thông tin người dùng
router.put("/update",verifyToken, updateUser);
router.put("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);
// Lấy danh sách người dùng (chỉ dành cho admin)
router.get("/list/all", getAllUsers);
// Xóa người dùng (chỉ dành cho admin)
router.delete("/:id", deleteUser);
router.put("/admin/:id", updateUserByAdmin);

module.exports = router;
