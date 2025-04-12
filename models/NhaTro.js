const { DataTypes, Sequelize  } = require("sequelize");
const sequelize = require("../config/db");


const NhaTro = sequelize.define(
    "NhaTro",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tenNhaTro: { type: DataTypes.STRING},
        diaChi: { type: DataTypes.STRING, allowNull: false },
        lat: { type: DataTypes.STRING },
        lon: { type: DataTypes.STRING },
        tenChuNha: { type: DataTypes.STRING },
        sdt: { type: DataTypes.STRING },
        soPhong: { type: DataTypes.INTEGER },
        kichThuocMin: { type: DataTypes.INTEGER },
        kichThuocMax: { type: DataTypes.INTEGER },
        giaMin: { type: DataTypes.INTEGER },
        giaMax: { type: DataTypes.INTEGER },
        tienDien: { type: DataTypes.INTEGER },
        tienNuoc: { type: DataTypes.INTEGER },
        trangThai: { type: DataTypes.INTEGER },
        conPhong: { type: DataTypes.BOOLEAN, defaultValue: true },
        khoangCachTruong: { type: DataTypes.INTEGER },

        ghiChu: { type: DataTypes.STRING },
        // createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal("GETDATE()") },
        // updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal("GETDATE()") },
        nguoiGioiThieu: { type: DataTypes.STRING },

        nguoiDuyet: { type: DataTypes.INTEGER },
        createdAt: { 
            type: DataTypes.DATE, 
            defaultValue: Sequelize.literal("GETDATE()") 
        },
        updatedAt: { 
            type: DataTypes.DATE, 
            defaultValue: Sequelize.literal("GETDATE()"),
        }
    },
    {
        
        tableName: "NhaTro",
        timestamps: true,
    }
);

module.exports = NhaTro;