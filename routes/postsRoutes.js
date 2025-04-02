const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  duyet,
  updatePost,
  deletePostById,
  uploadPostImages,
  getImagesByPostId,
} = require("../controllers/postController");

// Define routes
router.post("/create", createPost);
router.get("/all", getAllPosts);
router.put("/update/:id", updatePost);
router.delete("/delete/:id", deletePostById);
router.post("/upload/:post_id", uploadPostImages);
router.get("/images/:post_id", getImagesByPostId);
router.put("/post/duyet/:id", duyet);


module.exports = router;