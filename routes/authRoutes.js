const express = require("express");
const { register, login, verifyToken,refreshToken } = require("../controllers/authController");

const router = express.Router();

// Route đăng ký
router.post("/register", register);

// Route đăng nhập
router.post("/login", login);
router.post("/refresh-token",refreshToken);
// Route xác thực token
router.get("/verify", verifyToken, (req, res) => {
  res.json({ message: "Token hợp lệ", userId: req.userId });
});

module.exports = router;
