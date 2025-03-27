const sequelize = require("../config/db"); // ✅ Đảm bảo bạn có sequelize từ file config
const { Op, Sequelize } = require("sequelize"); // ✅ Thêm Sequelize
const express = require("express");
const { calculateHaversineDistance } = require("./OpenStresstMap")


const { TienIch, TienIchXungQuanh } = require("../models");

const createTienIch = async (req, res) => {
    try {
        const { tenTienIch } = req.body;

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
const createTienIchXungQuanh = async (req, res) => {
    try {
        const { tenTienIch, loai, lat, lon } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!tenTienIch || !loai || !lat || !lon) {
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
            lon
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
const getTienIchXungQuanh = async (req, res) => {
    try {
        const data = await TienIchXungQuanh.findAll({
            include: [{
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

module.exports = { createTienIch, createTienIchXungQuanh, getAllTienIchXungQuanh, getTienIchXungQuanh, getNearestTienIch };