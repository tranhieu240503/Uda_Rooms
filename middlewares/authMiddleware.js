const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Không có token, truy cập bị từ chối!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gán toàn bộ thông tin từ token vào req.user
    req.user = {
      id: decoded.id,
      fullname: decoded.fullname,
      avatar: decoded.avatar,
    };
    next(); // Tiến hành xử lý tiếp theo trong route
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = verifyToken;
