const express = require("express");
const sequelize = require("../config/db"); // ✅ Đảm bảo bạn có sequelize từ file config

const { Op, Sequelize } = require("sequelize"); // ✅ Thêm Sequelize
const { findNearbyAmenities } = require("./OpenStresstMap")
const { calculateHaversineDistance } = require("./OpenStresstMap")
const HinhAnhNhaTro = require("../models/HinhAnhNhaTro")
const fs = require("fs");
const path = require("path");
const { NhaTro, TienNghi, TienNghiNhaTro, ThongTinThemNhaTro, ThongTinThem ,DanhGiaNhaTro , Users  } = require("../models");
// tạo phòng trọ mớimới
const createNhaTro = async (req, res) => {
    try {
        // Lấy dữ liệu từ request
        const distance = calculateHaversineDistance(
            16.03219245, 108.22099429613442, // Toạ độ ĐH Đông Á
            parseFloat(req.body.lat), parseFloat(req.body.lon)
        );
        const nhaTroData = {
            tenNhaTro: req.body.tenNhaTro,
            diaChi: req.body.diaChi,
            lat: req.body.lat,
            lon: req.body.lon,
            tenChuNha: req.body.tenChuNha,
            sdt: req.body.sdt,
            soPhong: req.body.soPhong,
            kichThuocMin: req.body.kichThuocMin,
            kichThuocMax: req.body.kichThuocMax,
            giaMin: req.body.giaMin,
            giaMax: req.body.giaMax,
            tienDien: req.body.tienDien,
            tienNuoc: req.body.tienNuoc,
            trangThai: req.body.trangThai,
            ghiChu: req.body.ghiChu,
            nguoiGioiThieu: req.body.nguoiGioiThieu,
            nguoiDuyet: req.body.nguoiDuyet,
            khoangCachTruong: distance
        };

        // Tạo nhà trọ mới
        console.log(nhaTroData)

        const newNhaTro = await NhaTro.create(nhaTroData);
        if (!newNhaTro.id) {
            return res.status(500).json({ message: "Không thể tạo nhà trọ!" });
        }
        console.log(nhaTroData)
        const nhaTroId = newNhaTro.id;

        // Thêm tiện nghi phòng trọ
        const tienNghiList = req.body.tienNghi || [];

        if (tienNghiList.length > 0) {
            const tienNghiData = tienNghiList.map(item => ({
                idNhaTro: nhaTroId,
                idTienNghi: typeof item === 'object' ? item.idTienNghi : item
            }));

            await TienNghiNhaTro.bulkCreate(tienNghiData);
        }
        // Thêm thông tin thêm về phòng trọ
        const thongTinThemList = req.body.thongTinThem || [];
        if (thongTinThemList.length > 0) {
            const thongTinThemData = thongTinThemList.map(item => ({
                idNhaTro: nhaTroId,
                idThongTinThem: typeof item === 'object' ? item.idThongTinThem : item
            }));
            await ThongTinThemNhaTro.bulkCreate(thongTinThemData);
        }

        return res.status(201).json({
            message: "Tạo nhà trọ thành công!",
            nhaTro: newNhaTro,
            tienNghi: tienNghiList,
            thongTinThem: thongTinThemList
        });

    } catch (error) {
        res.status(500).json({ error: error.message || "Lỗi không xác định" });
    }
};


// hiển thị toàn bộ phòng trọ
const getAllNhaTro = async (req, res) => {
    try {
        const nhaTroList = await NhaTro.findAll();
        // const noiThatList = await NoiThat.findAll();

        res.status(200).json(nhaTroList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// chức năng tìm kiếm
const findNhaTro = async (req, res) => {
    try {
        let whereCondition = {}; // Điều kiện tìm kiếm

        // ✅ 1. Lọc theo giá thuê
        if (req.body.giaMin || req.body.giaMax) {
            const giaMinUser = req.body.giaMin ? parseInt(req.body.giaMin) : null;
            const giaMaxUser = req.body.giaMax ? parseInt(req.body.giaMax) : null;

            if (giaMinUser !== null && giaMaxUser !== null && giaMinUser > giaMaxUser) {
                return res.status(400).json({ message: "Giá tối thiểu không thể lớn hơn giá tối đa!" });
            }

            whereCondition[Op.and] = whereCondition[Op.and] || [];
            if (giaMinUser !== null) whereCondition[Op.and].push({ giaMax: { [Op.gte]: giaMinUser } });
            if (giaMaxUser !== null) whereCondition[Op.and].push({ giaMin: { [Op.lte]: giaMaxUser } });
        }

        // ✅ 2. Lọc theo kích thước phòng
        if (req.body.kichThuocMin || req.body.kichThuocMax) {
            const kichThuocMinUser = req.body.kichThuocMin ? parseInt(req.body.kichThuocMin) : null;
            const kichThuocMaxUser = req.body.kichThuocMax ? parseInt(req.body.kichThuocMax) : null;

            if (kichThuocMinUser !== null && kichThuocMaxUser !== null && kichThuocMinUser > kichThuocMaxUser) {
                return res.status(400).json({ message: "Kích thước tối thiểu không thể lớn hơn kích thước tối đa!" });
            }

            whereCondition[Op.and] = whereCondition[Op.and] || [];
            if (kichThuocMinUser !== null) whereCondition[Op.and].push({ kichThuocMax: { [Op.gte]: kichThuocMinUser } });
            if (kichThuocMaxUser !== null) whereCondition[Op.and].push({ kichThuocMin: { [Op.lte]: kichThuocMaxUser } });
        }

        // ✅ 3. Lọc theo tiện nghi (nếu có)
        let includeTienNghi = [];
        if (req.body.TienNghi && req.body.TienNghi.length > 0) {
            includeTienNghi = [
                {
                    model: TienNghi,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    attributes: ["id"], // Chỉ lấy ID để kiểm tra
                    where: {
                        id: { [Op.in]: req.body.TienNghi }
                    },
                    required: true // Bắt buộc phải có tiện nghi
                }
            ];
        }

        // ✅ 4. Tìm kiếm nhà trọ từ DB
        let nhaTroList = await NhaTro.findAll({
            where: whereCondition,
            include: includeTienNghi,
        });

        // ✅ 5. Lọc bỏ những nhà trọ không có đủ tiện nghi yêu cầu
        if (req.body.TienNghi && req.body.TienNghi.length > 0) {
            const requiredTienNghiIds = new Set(req.body.TienNghi.map(id => parseInt(id)));

            nhaTroList = nhaTroList.filter(nhaTro => {
                const nhaTroTienNghiIds = new Set(nhaTro.TienNghis.map(tn => tn.id));
                return [...requiredTienNghiIds].every(id => nhaTroTienNghiIds.has(id));
            });
        }

        // ✅ 6. Lọc theo khoảng cách (nếu có radius)
        if (req.body.radius) {
            const radius = parseFloat(req.body.radius); // Đơn vị: mét
            nhaTroList = nhaTroList.filter(nhaTro => {
                if (!nhaTro.lat || !nhaTro.lon) return false;
                const distance = calculateHaversineDistance(
                    16.03219245, 108.22099429613442, // Toạ độ ĐH Đông Á
                    parseFloat(nhaTro.lat), parseFloat(nhaTro.lon)
                );

                return distance <= radius; // Chỉ giữ nhà trọ trong bán kính
            });
        }

        return res.status(200).json(nhaTroList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// tìm kiếm tiện ích xung quanh
const findtienich = async (req, res) => {
    try {
        const khanh = await findNearbyAmenities(req.body.lon, req.body.lat)
        res.status(200).json(khanh)
    } catch (error) {
        res.status(500).json({ error: error.message });

    }

}

const upfiles = async (req, res) => {
    try {
        if (!req.file && (!req.files || req.files.length === 0)) {
            return res.status(400).json({ error: "Không có file nào được tải lên!" });
        }

        console.log("File nhận được:", req.file || req.files);
        console.log("ID nhà trọ nhận được:", req.body.nhaTroId);

        let uploadedImages = [];

        if (req.file) {
            // Trường hợp upload 1 ảnh
            const image = await HinhAnhNhaTro.create({
                nhaTroId: req.body.nhaTroId, 
                hinhAnh: req.file.filename // Lưu TÊN FILE thay vì đường dẫn
            });
            uploadedImages.push(image);
        } else {
            // Trường hợp upload nhiều ảnh
            uploadedImages = await Promise.all(req.files.map(async (file) => {
                return await HinhAnhNhaTro.create({
                    nhaTroId: req.body.nhaTroId,
                    hinhAnh: file.filename // Chỉ lưu tên file
                });
            }));
        }

        res.status(201).json({ message: "Upload thành công!", data: uploadedImages });

    } catch (error) {
        console.error("Lỗi khi upload file:", error);
        res.status(500).json({ error: error.message });
    }
};
const deleteNhaTro = async (req, res) => {
    try {
        
        const { id } = req.params;
        const deleted = await NhaTro.destroy({ where: { id } });
        if (deleted) {
            return res.json({ message: "Xóa tiện nghi thành công!" });
        }
        return res.status(404).json({ message: "Không tìm thấy tiện nghi!" });
    } catch (error) {
        console.error("Lỗi khi xóa tiện nghi:", error);
        return res.status(500).json({ message: "Lỗi server", error });
    }
}
const deleteFile = async (req, res) => {
    try {
        console.log(req.body)
        const { nhaTroId, hinhAnh } = req.body;

        if (!nhaTroId || !hinhAnh) {
            return res.status(400).json({ error: "Thiếu thông tin nhà trọ hoặc tên file ảnh!" });
        }

        // Tìm ảnh cần xóa
        const image = await HinhAnhNhaTro.findOne({
            where: { nhaTroId, hinhAnh }
        });

        if (!image) {
            return res.status(404).json({ error: "Ảnh không tồn tại!" });
        }

        // Xóa ảnh khỏi database
        await image.destroy();

        res.status(200).json({ message: "Xóa ảnh thành công!" });

    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        res.status(500).json({ error: error.message });
    }
};

const getRoom = async (req, res) => {
    try {
        const { idNhaTro } = req.params;

        // Tìm thông tin nhà trọ

        const listRoom = await NhaTro.findOne({
            where: { id: idNhaTro },
            include: [
                {
                    model: TienNghi,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    attributes: ["id", "tenTienNghi"]
                },
                {
                    model: ThongTinThem,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    attributes: ["id", "ThongtinThem"]
                }
            ]

        });

        if (!listRoom) {
            return res.status(404).json({ message: "Không tìm thấy nhà trọ!" });
        }

        return res.status(200).json(listRoom);

    } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


const getImage = async (req, res) => {
    try {
        const { idNhaTro } = req.params; // Lấy idNhaTro từ request

        // Tìm tất cả ảnh có cùng idNhaTro
        const imageRecords = await HinhAnhNhaTro.findAll({
            where: { nhaTroId: idNhaTro },
        });

        if (!imageRecords.length) {
            return res.status(404).json({ error: "Không tìm thấy hình ảnh nào cho nhà trọ này" });
        }

        // Tạo một mảng chứa dữ liệu ảnh dưới dạng binary
        const images = imageRecords.map(img => ({
            id: img.id,
            nhaTroId: img.nhaTroId,
            hinhAnh: img.hinhAnh, 
        }));

        res.setHeader("Content-Type", "application/json");
        res.json(images); // Trả về danh sách ảnh dưới dạng binary
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllTienNghi = async (req, res) => {
    try {
        const TienNGhiList = await TienNghi.findAll();
        // const noiThatList = await NoiThat.findAll();
        res.status(200).json(TienNGhiList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllThongTinThem = async (req, res) => {
    try {
        const ThongTinThemList = await ThongTinThem.findAll();
        // const noiThatList = await NoiThat.findAll();
        res.status(200).json(ThongTinThemList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const danhGiaNhaTro = async (req, res) => {
    try {
        const { noiDung, soSao } = req.body;
        const { maNhaTro } = req.params; // 📌 Lấy maNhaTro từ params
        const nguoiDanhGia = req.body.id; // Lấy ID người dùng từ request (middleware xác thực)

        // Kiểm tra nhà trọ có tồn tại không
        const nhaTro = await NhaTro.findByPk(maNhaTro);
        if (!nhaTro) {
            return res.status(404).json({ message: "Nhà trọ không tồn tại" });
        }

        // Tìm đánh giá của người dùng cho nhà trọ này
        let danhGia = await DanhGiaNhaTro.findOne({
            where: { maNhaTro, nguoiDanhGia }
        });

        if (danhGia) {
            // ✅ Cập nhật cả nội dung và số sao
            danhGia.noiDung = noiDung;
            danhGia.soSao = soSao;
            await danhGia.save();
            return res.status(200).json({ message: "Cập nhật đánh giá thành công", danhGia });
        } else {
            // Nếu chưa đánh giá -> Tạo mới
            danhGia = await DanhGiaNhaTro.create({
                maNhaTro,
                nguoiDanhGia,
                noiDung,
                soSao
            });
            return res.status(201).json({ message: "Đánh giá thành công", danhGia });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDanhGiaNhaTro = async (req, res) => {
    try {
        const { maNhaTro } = req.params;

        // Kiểm tra nhà trọ có tồn tại không
        const nhaTro = await NhaTro.findByPk(maNhaTro);
        if (!nhaTro) {
            return res.status(404).json({ message: "Nhà trọ không tồn tại" });
        }

        // Lấy tất cả đánh giá của nhà trọ
        const danhGiaList = await DanhGiaNhaTro.findAll({
            where: { maNhaTro },
            include: {
                model: Users,
                attributes: ["id", "fullname", "avatar"] // Lấy thông tin user đánh giá
            },
            order: [["createdAt", "DESC"]]
        });

        console.log("🔥 Danh sách đánh giá:", JSON.stringify(danhGiaList, null, 2));

        // Tính trung bình số sao
        const tongSoSao = danhGiaList.reduce((sum, dg) => sum + dg.soSao, 0);
        const trungBinhSao = danhGiaList.length > 0 ? (tongSoSao / danhGiaList.length).toFixed(1) : 0;

        return res.status(200).json({
            message: "Lấy danh sách đánh giá thành công",
            trungBinhSao,
            danhGiaList
        });

    } catch (error) {
        console.error("🔥 Lỗi tại server:", error);
        return res.status(500).json({ error: error.message });
    }
};

const duyet = async (req, res) => {
    const { id } = req.params;
  
    try {
      const nhaTro = await NhaTro.findByPk(id);
  
      if (!nhaTro) {
        return res.status(404).json({ message: "Nhà trọ không tồn tại" });
      }
  
      // Lấy trạng thái hiện tại
      const currentTrangThai = nhaTro.trangThai;
  
      // Toggle trạng thái (0 -> 1 hoặc 1 -> 0)
      nhaTro.trangThai = currentTrangThai === 0 ? 1 : 0;
  
      await nhaTro.save();
  
      return res.status(200).json({
        message: `Trạng thái đã được thay đổi thành ${nhaTro.trangThai === 1 ? 'Đã Duyệt' : 'Chưa Duyệt'}`,
        nhaTro,
      });
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      return res.status(500).json({ message: "Lỗi khi thay đổi trạng thái nhà trọ" });
    }
  };
  const updateNhaTro = async (req, res) => {
    try {
        const { id } = req.params; // ✅ Đúng với route

        // Tìm nhà trọ theo id
        const nhaTro = await NhaTro.findByPk(id);
        if (!nhaTro) {
            return res.status(404).json({ message: "Không tìm thấy nhà trọ" });
        }

        // Cập nhật thông tin nhà trọ
        await nhaTro.update(req.body);

        res.status(200).json({ message: "Cập nhật nhà trọ thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi cập nhật nhà trọ" });
    }
};

//new
const createTienNghi = async (req, res) => {
    try {
        const { tenTienNghi } = req.body;
        if (!tenTienNghi) {
            return res.status(400).json({ message: "Tên tiện nghi không được để trống" });
        }
        const newTienNghi = await TienNghi.create({ tenTienNghi });
        return res.status(201).json(newTienNghi);
    } catch (error) {
        console.error("Lỗi khi thêm tiện nghi:", error);
        return res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🔴 Xóa tiện nghi theo ID
const deleteTienNghi = async (req, res) => {
    try {
        
        const { id } = req.params;
        const deleted = await TienNghi.destroy({ where: { id } });
        if (deleted) {
            return res.json({ message: "Xóa tiện nghi thành công!" });
        }
        return res.status(404).json({ message: "Không tìm thấy tiện nghi!" });
    } catch (error) {
        console.error("Lỗi khi xóa tiện nghi:", error);
        return res.status(500).json({ message: "Lỗi server", error });
    }
};
const addThongTinThem = async (req, res) => {
    try {
        const { thongTinThem } = req.body;
        if (!thongTinThem) {
            return res.status(400).json({ error: "Vui lòng nhập thông tin!" });
        }
        const newItem = await ThongTinThem.create({ thongTinThem });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi thêm dữ liệu!" });
    }
};

// 🔴 Xóa thông tin thêm theo ID
const deleteThongTinThem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ThongTinThem.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "Không tìm thấy thông tin cần xóa!" });
        }
        await item.destroy();
        res.json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa dữ liệu!" });
    }
};
module.exports = { deleteNhaTro,deleteThongTinThem, addThongTinThem ,createTienNghi,deleteTienNghi,deleteFile,getAllTienNghi, getAllThongTinThem, createNhaTro, getAllNhaTro, findNhaTro, findtienich, upfiles, getImage, getRoom, danhGiaNhaTro,getDanhGiaNhaTro,duyet,updateNhaTro };