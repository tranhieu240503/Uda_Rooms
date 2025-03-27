const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const TienIch = require("./TienIch"); // Import model TienIch

const TienIchXungQuanh = sequelize.define(
  "TienIchXungQuanh",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenTienIch: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    loai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TienIch, // Khóa ngoại liên kết với bảng TienIch
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lat: {
      type: DataTypes.STRING(255),
    },
    lon: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "TienIchXungQuanh",
    timestamps: false,
  }
);

// Thiết lập quan hệ 1-N
TienIch.hasMany(TienIchXungQuanh, { foreignKey: "loai", onDelete: "CASCADE" });
TienIchXungQuanh.belongsTo(TienIch, { foreignKey: "loai", onDelete: "CASCADE" });

module.exports = TienIchXungQuanh;