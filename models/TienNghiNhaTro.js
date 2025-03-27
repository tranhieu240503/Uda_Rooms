const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const NhaTro = require("./NhaTro");
const TienNghi = require("./TienNghi");

const TienNghiNhaTro = sequelize.define(
    "TienNghiNhaTro",
    {
        idNhaTro: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: NhaTro,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        idTienNghi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: TienNghi,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "TienNghiNhaTro", // Đặt lại tên đúng chuẩn
        timestamps: false
    }
);

module.exports = TienNghiNhaTro;
