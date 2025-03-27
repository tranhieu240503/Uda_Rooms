const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const sequelize = require("./config/db");

const path = require("path");
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const nhaTrorouter = require("./routes/NhaTroRoutes");

const tienichrouter = require("./routes/TienIchRouter");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("common"));
app.use(cors());

// Cấu hình static files
app.use('/uploads', express.static('uploads'));
// Thêm dòng này để phục vụ file tĩnh từ thư mục upload_avataruser
app.use('/upload_avataruser', express.static('upload_avataruser'));
app.use("/uploads_post", express.static(path.join(__dirname, "uploads_post")));
// Routes
app.use("/api",tienichrouter)
app.use("/api/", nhaTrorouter);
app.use("/api/auth", authRoutes);
app.use("/api", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("Backend is running!");
});
