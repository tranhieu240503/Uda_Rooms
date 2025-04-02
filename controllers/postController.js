const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Posts, Users, Images } = require("../models");

const uploadDir = path.join(__dirname, "../uploads_post");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ hỗ trợ định dạng JPG, PNG, WEBP"), false);
    }
    cb(null, true);
  },
}).array("images", 5);

const uploadPostImages = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { post_id } = req.params;
      if (!post_id) return res.status(400).json({ error: "Thiếu post_id" });

      const post = await Posts.findByPk(post_id);
      if (!post) return res.status(404).json({ error: "Bài viết không tồn tại" });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Không có ảnh nào được tải lên" });
      }

      const savedImages = [];
      let imageCounter = 1; // Start counting images from 1

      for (const file of req.files) {
        const imageName = `post_${post_id}_${imageCounter}.jpeg`; // e.g., post_6_1.webp
        const outputPath = path.join(uploadDir, imageName);

        await sharp(file.buffer)
          .jpeg({ quality: 80 }) // Compress to WebP with 80% quality, no resize
          .toFile(outputPath);

        const imageUrl = `/uploads_post/${imageName}`;
        await Images.create({
          post_id: parseInt(post_id),
          image_url: imageUrl,
        });
        savedImages.push(imageUrl);
        imageCounter++; // Increment for the next image
      }

      return res.status(200).json({ message: "Tải ảnh lên thành công", images: savedImages });
    } catch (err) {
      console.error("Lỗi khi tải ảnh lên:", err);
      return res.status(500).json({ error: "Lỗi tải ảnh lên", details: err.message });
    }
  });
};

// Other functions (unchanged for brevity)
const createPost = async (req, res) => {
  try {
    const { user_id, content, status, loaiPost } = req.body;
    if (!user_id || !content) {
      return res.status(400).json({ error: "Thiếu user_id hoặc nội dung bài viết" });
    }

    const user = await Users.findByPk(user_id);
    if (!user) return res.status(404).json({ error: "Người dùng không tồn tại" });

    const newPost = await Posts.create({
      user_id,
      content,
      status: status || false,
      loaiPost: loaiPost || "không chọn",
    });

    return res.status(201).json({ message: "Đăng bài thành công!", post: newPost });
  } catch (err) {
    console.error("Lỗi đăng bài:", err);
    return res.status(500).json({ error: "Lỗi đăng bài", details: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll({
      include: [
        {
          model: Users,
          as: "author",
          attributes: ["id", "fullname", "avatar"],
        },
        {
          model: Images,
          as: "images",
          attributes: ["image_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("Lỗi lấy danh sách bài viết:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status, loaiPost } = req.body;

    const post = await Posts.findByPk(id);
    if (!post) return res.status(404).json({ error: "Bài viết không tồn tại" });

    post.content = content || post.content;
    post.status = status || post.status;
    post.loaiPost = loaiPost || post.loaiPost;

    await post.save();
    return res.status(200).json({ message: "Cập nhật bài viết thành công", post });
  } catch (err) {
    console.error("Lỗi cập nhật bài viết:", err);
    return res.status(500).json({ error: "Lỗi cập nhật bài viết", details: err.message });
  }
};
const getImagesByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;

    // Ép kiểu post_id nếu cần
    const postId = isNaN(post_id) ? post_id : parseInt(post_id, 10);

    const images = await Images.findAll({
      where: { post_id: postId },
      attributes: ["image_url"],
    });

    if (images.length === 0) {
      return res.status(404).json({ error: "Không có ảnh nào cho bài viết này" });
    }

    // Chỉ trả về mảng URL nếu frontend cần
    const imageUrls = images.map(img => img.image_url);
    return res.status(200).json(imageUrls);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách ảnh:", err);
    return res.status(500).json({ error: "Lỗi server", details: err.message });
  }
};
const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findByPk(id);
    if (!post) return res.status(404).json({ error: "Bài viết không tồn tại" });

    const images = await Images.findAll({ where: { post_id: id } });
    for (const img of images) {
      const imagePath = path.join(uploadDir, path.basename(img.image_url));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Images.destroy({ where: { post_id: id } });
    await post.destroy();

    return res.status(200).json({ message: "Xóa bài viết thành công" });
  } catch (err) {
    console.error("Lỗi xóa bài viết:", err);
    return res.status(500).json({ error: "Lỗi xóa bài viết", details: err.message });
  }
};
const duyet = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Trạng thái mới:",req.params);
      const post = await Posts.findByPk(id);

      if (!post) {
          return res.status(404).json({ message: "Bài viết không tồn tại" });
      }

      // Lấy trạng thái hiện tại
      const currentStatus = post.status;
      console.log("Trạng thái mới:", currentStatus);

      // Toggle trạng thái (chờ duyệt -> đã duyệt hoặc ngược lại)
      post.status = currentStatus === false ? true : false;
      console.log("Trạng thái mới:", post.status);
      await post.save();

      return res.status(200).json({
          message: `Trạng thái bài viết đã được thay đổi thành: ${post.status}`,
          post,
      });
  } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái bài viết:", error);
      return res.status(500).json({ message: "Lỗi khi duyệt bài viết" });
  }
};


module.exports = {
  duyet,
  createPost,
  getAllPosts,
  updatePost,
  deletePostById,
  uploadPostImages,
  getImagesByPostId,
};