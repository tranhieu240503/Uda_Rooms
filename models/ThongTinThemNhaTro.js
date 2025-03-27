const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const NhaTro = require("./NhaTro");
const ThongTinThem = require("./ThongTinThem");

const ThongTinThemNhaTro = sequelize.define(
    "ThongTinThemNhaTro",
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
        idThongTinThem: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ThongTinThem,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "ThongTinThemNhaTro",
        timestamps: false
    }
);

module.exports = ThongTinThemNhaTro;
