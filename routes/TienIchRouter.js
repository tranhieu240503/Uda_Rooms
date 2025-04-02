const express = require("express");
const { updateTienIchXungQuanh, deleteTienIchXungQuanh ,deleteTienIch, createTienIch, createTienIchXungQuanh, getAllTienIchXungQuanh, getAllTienIch, getNearestTienIch } = require("../controllers/TienIchController")
const router = express.Router();

router.post("/tien-ich-xung-quanh", getNearestTienIch)
router.get("/tien-ich", getAllTienIchXungQuanh)
router.post("/tao-tien-ich",createTienIch)
router.post("/tao-tien-ich-xung-quanh",createTienIchXungQuanh)
router.get("/tien-ich-all",getAllTienIch)
router.put("/chinh-sua-tien-ich-xung-quanh/:id",updateTienIchXungQuanh)
router.delete("/xoa-tien-ich/:id",deleteTienIch)
router.delete("/xoa-tien-ich-xung-quanh/:id",deleteTienIchXungQuanh)

module.exports = router;