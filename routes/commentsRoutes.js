const express = require("express");
const router = express.Router();
const { createComment, getCommentsByPost, updateComment, deleteComment } = require("../controllers/commentController");

// Các route xử lý bình luận
router.post("/", createComment);  // Đường dẫn tạo bình luận
router.get("/:post_id", getCommentsByPost); // Lấy bình luận theo post_id
router.put("/:idcomment", updateComment);  // Cập nhật bình luận theo idcomment
router.delete("/:idcomment", deleteComment);  // Xóa bình luận theo idcomment
module.exports = router;
