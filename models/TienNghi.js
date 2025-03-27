const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TienNghi = sequelize.define(
    "TienNghi",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tenTienNghi: { type: DataTypes.STRING }
    },
    {
        tableName: "TienNghi", // Đổi lại tên bảng cho đồng bộ
        timestamps: false
    }
);

module.exports = TienNghi;