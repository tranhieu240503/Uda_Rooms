const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
require("dotenv").config();
const moment = require("moment");
const { getUserByEmail } = require("../services/userService"); 

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const avatar = "avatar_mac_dinh.jpg"
        // Kiểm tra email đã tồn tại chưa
        const fullname ="Người dùng ẩn danh"
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email đã tồn tại" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = await Users.create({
            email,
            avatar,
            password: hashedPassword,
            fullname : fullname
        });

        // Trả về thông tin user nhưng không bao gồm mật khẩu
        return res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                iduser: newUser.iduser,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });
    } catch (error) {
        console.log("Lỗi đăng ký:", error);
        return res.status(500).json({ error: "Lỗi đăng ký" });
    }
};
const verifyToken = (req, res) => {
    try {
        const token = req.header("Authorization").split(" ")[1]; // Lấy token từ header
        if (!token) return res.status(401).json({ error: "Không có token, truy cập bị từ chối" });

        const verified = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        res.json({ message: "Token hợp lệ", Id: verified.id });
    } catch (err) {
        res.status(401).json({ error: "Token không hợp lệ" });
    }
};const refreshToken = async (req, res) => {
    try {
      const { userId, fullname, avatar } = req.body;
  
      // Tạo token mới với thông tin cập nhật
      const newToken = jwt.sign(
        {
          id: userId,
          fullname,
          avatar,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({ token: newToken });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại" });
    }
  };
  

const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email và mật khẩu không được để trống" });
    }
  
    try {
      const user = await getUserByEmail(email);
      console.log("user",user)
  
      if (!user) {
        return res.status(400).json({ error: "Email không tồn tại" });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Sai mật khẩu" });
      }
  
      // Tạo token với các trường id, fullname, avatar
      const token = jwt.sign(
        {
          id: user.id,
          fullname: user.fullname,
          avatar: user.avatar,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({ message: "Đăng nhập thành công!", token });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại" });
    }
  };
module.exports = { register, login, verifyToken,refreshToken};
