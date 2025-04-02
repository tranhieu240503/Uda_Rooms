const sequelize = require("../config/db"); // ✅ Đảm bảo bạn có sequelize từ file config
const { Op, Sequelize } = require("sequelize"); // ✅ Thêm Sequelize
const express = require("express");
const { calculateHaversineDistance } = require("./OpenStresstMap")


const { TienIch, TienIchXungQuanh } = require("../models");

const createTienIch = async (req, res) => {
    try {
        const { tenTienIch } = req.body;
        console.log(req.body)

        // Kiểm tra nếu tên tiện ích bị thiếu
        if (!tenTienIch) {
            return res.status(400).json({ message: "Tên tiện ích không được để trống" });
        }

        // Tạo tiện ích mới
        const newTienIch = await TienIch.create({ tenTienIch });

        return res.status(201).json({
            message: "Tiện ích được tạo thành công",
            data: newTienIch
        });
    } catch (error) {
        console.error("Lỗi tạo tiện ích:", error);
        return res.status(500).json({ message: "Lỗi khi tạo tiện ích" });
    }
};
const updateTienIchXungQuanh = async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL
      const { tenTienIch, loai, lat, lon, diaChi } = req.body; // Lấy dữ liệu từ body
  
      // Kiểm tra tiện ích có tồn tại không
      const tienIch = await TienIchXungQuanh.findByPk(id);
      if (!tienIch) {
        return res.status(404).json({ message: "Tiện ích không tồn tại!" });
      }
  
      // Cập nhật thông tin
      await tienIch.update({ tenTienIch, loai, lat, lon, diaChi });
  
      return res.json({ message: "Cập nhật thành công!", data: tienIch });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật tiện ích:", error);
      return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
  };
  
const deleteTienIchXungQuanh = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        // 🔴 Đổi tên biến để tránh ghi đè model
        const tienIchXQ = await TienIchXungQuanh.findByPk(id);

        if (!tienIchXQ) {
            return res.status(404).json({ message: "Tiện ích không tồn tại" });
        }

        await tienIchXQ.destroy();

        return res.status(200).json({ message: "Tiện ích đã được xóa thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa tiện ích:", error);
        return res.status(500).json({ message: "Lỗi khi xóa tiện ích" });
    }
};

const deleteTienIch = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra nếu id không hợp lệ
        if (!id) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        // Tìm tiện ích theo ID
        const tienIch = await TienIch.findByPk(id);

        if (!tienIch) {
            return res.status(404).json({ message: "Tiện ích không tồn tại" });
        }

        // Xóa tiện ích
        await tienIch.destroy();

        return res.status(200).json({ message: "Tiện ích đã được xóa thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa tiện ích:", error);
        return res.status(500).json({ message: "Lỗi khi xóa tiện ích" });
    }
};
const createTienIchXungQuanh = async (req, res) => {
    try {
        const { tenTienIch, loai, lat, lon, diaChi } = req.body; // 🟢 Thêm `diaChi`

        // Kiểm tra dữ liệu đầu vào
        if (!tenTienIch || !loai || !lat || !lon || !diaChi) { // 🟢 Kiểm tra `diaChi`
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        // Kiểm tra nếu loai (id của TienIch) có tồn tại không
        const checkTienIch = await TienIch.findByPk(loai);
        if (!checkTienIch) {
            return res.status(404).json({ message: "Loại tiện ích không hợp lệ" });
        }

        // Tạo tiện ích xung quanh mới
        const newTienIchXungQuanh = await TienIchXungQuanh.create({
            tenTienIch,
            loai,
            lat,
            lon,
            diaChi // 🟢 Lưu `diaChi`
        });

        return res.status(201).json({
            message: "Tiện ích xung quanh được tạo thành công",
            data: newTienIchXungQuanh
        });
    } catch (error) {
        console.error("Lỗi khi tạo tiện ích xung quanh:", error);
        return res.status(500).json({ message: "Lỗi server khi tạo tiện ích xung quanh" });
    }
};

const getAllTienIchXungQuanh = async (req, res) => {
    try {
        const data = await TienIchXungQuanh.findAll({
            include: [
                {
                    model: TienIch,
                    as: "TienIch", // Đúng alias đã khai báo trong quan hệ
                    attributes: ["id", "tenTienIch"] // Lấy thông tin cần thiết
                }
            ]
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tiện ích xung quanh:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};
const getAllTienIch = async (req, res) => {
    try {
        const tienIchList = await TienIch.findAll(); // Lấy toàn bộ dữ liệu
        res.json(tienIchList); // Trả về JSON
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tiện ích:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getNearestTienIch = async (req, res) => {
    try {
        console.log("📥 Dữ liệu nhận được:", req.body);  // ✅ Kiểm tra dữ liệu từ request

        const { lat, lon } = req.body;
        if (!lat || !lon) {
            return res.status(400).json({ message: "Vui lòng cung cấp lat và lon" });
        }

        // Lấy tất cả tiện ích
        const tienIchList = await TienIchXungQuanh.findAll();

        // Nhóm tiện ích theo loại và chọn cái gần nhất
        const nearestTienIch = {};
        tienIchList.forEach(ti => {
            const distance = calculateHaversineDistance(lat, lon, ti.lat, ti.lon);
            if (!nearestTienIch[ti.loai] || distance < nearestTienIch[ti.loai].distance) {
                nearestTienIch[ti.loai] = {
                    ...ti.toJSON(),
                    distance: distance
                };
            }
        });

        res.json(Object.values(nearestTienIch));
    } catch (error) {
        console.error("❌ Lỗi khi lấy tiện ích gần nhất:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

module.exports = { updateTienIchXungQuanh ,deleteTienIchXungQuanh, deleteTienIch , createTienIch, createTienIchXungQuanh, getAllTienIchXungQuanh, getAllTienIch, getNearestTienIch };