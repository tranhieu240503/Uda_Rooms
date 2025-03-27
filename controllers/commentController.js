const Comment = require("../models/Comments"); // ✅ Import đúng model Comments

const createComment = async (req, res) => {
  console.log("🔹 Headers nhận được:", req.headers); 
  console.log("🔹 Body nhận được:", req.body); // Kiểm tra body có dữ liệu không

  // Kiểm tra xem body có dữ liệu không
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Không nhận được dữ liệu trong body" });
  }

  const { user_id, post_id, content } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!user_id || !content) {
    return res.status(400).json({ error: "Thiếu user_id hoặc nội dung" });
  }

  try {
    // Tạo bình luận mới
    const newComment = await Comment.create({ user_id, post_id, content, status: "chưa sửa" });
    return res.status(201).json({ message: "Bình luận đã được tạo", comment: newComment });
  } catch (error) {
    console.error("❌ Lỗi khi tạo bình luận:", error);
    return res.status(500).json({ error: "Lỗi tạo bình luận", details: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    if (!post_id) {
      return res.status(400).json({ error: "Thiếu post_id" });
    }

    const comments = await Comment.findAll({
      where: { post_id },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    return res.status(500).json({ error: "Lỗi lấy danh sách bình luận", details: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { idcomment } = req.params;
    const { content, image } = req.body;

    const comment = await Comment.findByPk(idcomment);
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận" });
    }

    // Cập nhật bình luận
    await comment.update({
      content: content || comment.content,
      image: image || comment.image,
      status: "đã sửa",
    });

    return res.status(200).json({ message: "Bình luận đã được cập nhật", comment });
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận:", error);
    return res.status(500).json({ error: "Lỗi cập nhật bình luận", details: error.message });
  }
};
const deleteComment = async (req, res) => {
    try {
      const { idcomment } = req.params;
  
      const comment = await Comment.findByPk(idcomment);
      if (!comment) {
        return res.status(404).json({ error: "Không tìm thấy bình luận" });
      }
  
      // Xóa bình luận
      await comment.destroy();
  
      return res.status(200).json({ message: "Bình luận đã được xóa" });
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      return res.status(500).json({ error: "Lỗi xóa bình luận", details: error.message });
    }
  };
module.exports = { createComment, getCommentsByPost, updateComment, deleteComment};
