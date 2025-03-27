const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ThongTinThem = sequelize.define(
    "ThongTinThem",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        thongTinThem: { type: DataTypes.STRING }
    },
    {
        tableName: "ThongTinThem",
        timestamps: false
    }
);

module.exports = ThongTinThem;
