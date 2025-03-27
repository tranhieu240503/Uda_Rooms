const express = require("express");
const { createTienIch, createTienIchXungQuanh, getAllTienIchXungQuanh, getTienIchXungQuanh, getNearestTienIch } = require("../controllers/TienIchController")
const router = express.Router();

router.post("/tien-ich-xung-quanh", getNearestTienIch)
router.get("/tien-ich", getAllTienIchXungQuanh)



module.exports = router;