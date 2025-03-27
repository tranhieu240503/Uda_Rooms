const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const NhaTro = require("./NhaTro"); // Import model NhaTro để liên kết

const HinhAnhNhaTro = sequelize.define(
    "HinhAnhNhaTro",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nhaTroId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: NhaTro,
                key: "id"
            },
            onDelete: "CASCADE" // Xóa nhà trọ thì xóa luôn ảnh
        },
        hinhAnh: {
            type: DataTypes.INTEGER, 
            allowNull: false
        }
    },
    {
        tableName: "HinhAnhNhaTro",
        timestamps: false,
    }
);

module.exports = HinhAnhNhaTro;
