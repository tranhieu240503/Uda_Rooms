const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Xác định role: 1 là admin, còn lại là user
    const role = decoded.role === 1 ? "admin" : "user";

    // Gán thông tin vào req.user
    req.user = {
      id: decoded.id,
      fullname: decoded.fullname,
      avatar: decoded.avatar,
      role: role, // 'admin' hoặc 'user'
    };

    next(); // Tiếp tục xử lý request
  } catch (err) {
    console.error("Lỗi xác thực token:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token đã hết hạn, vui lòng đăng nhập lại!" });
    }

    return res.status(403).json({ error: "Token không hợp lệ!" });
  }
};


module.exports = verifyToken;
