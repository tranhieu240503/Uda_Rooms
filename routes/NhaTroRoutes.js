const express = require("express");
const {deleteNhaTro, duyet,deleteThongTinThem,addThongTinThem,createTienNghi,deleteTienNghi,deleteFile,createNhaTro, getAllNhaTro,getDanhGiaNhaTro,danhGiaNhaTro , findNhaTro, findtienich, upfiles, getImage, getRoom, getAllTienNghi, getAllThongTinThem, updateNhaTro } = require("../controllers/NhaTroController"); 
const { uploadSingle, uploadMultiple,processImage ,processMultipleImages} = require("../middlewares/upload");
const router = express.Router();

router.post("/nha-tro", createNhaTro);
router.post("/find-nha-tro", findNhaTro);
router.post("/upload-multiple", uploadMultiple, processMultipleImages,upfiles)
router.post("/upload-single", uploadSingle,processImage, upfiles)
router.post("/danh-gia/:maNhaTro",danhGiaNhaTro )
router.post("/findtienich", findtienich)
router.post("/duyet/:id",duyet)
router.post("/them-thong-tin",addThongTinThem)
router.delete("/xoa-thong-tin/:id",deleteThongTinThem)
router.post("/them-tien-nghi", createTienNghi)
router.delete("/xoa-tien-nghi/:id", deleteTienNghi)
router.put("/update-nha-tro/:id", updateNhaTro);
router.get("/getimg/:idNhaTro", getImage);
router.get("/getroom/:idNhaTro", getRoom)
router.delete("/xoa-nha-tro/:id",deleteNhaTro)
// router.post("/test",test)
router.get("/danh-gia/:maNhaTro", getDanhGiaNhaTro);
router.get("/tien-nghi", getAllTienNghi);
router.get("/thong-tin-them", getAllThongTinThem);
router.get("/nha-tro", getAllNhaTro);
router.delete("/delete-img",deleteFile)
module.exports = router;