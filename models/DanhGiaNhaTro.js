const { DataTypes,Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const DanhGiaNhaTro = sequelize.define("DanhGiaNhaTro", {
    maNhaTro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "NhaTro",
            key: "idNhaTro"
        }
    },
    nguoiDanhGia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    noiDung: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    soSao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }, 
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
    tableName: "DanhGiaNhaTro",
    timestamps: true,  // ✅ Đảm bảo Sequelize tự động tạo createdAt & updatedAt

});


module.exports = DanhGiaNhaTro;