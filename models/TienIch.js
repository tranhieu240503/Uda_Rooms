const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Kết nối DB

const TienIch = sequelize.define(
  "TienIch",
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
  },
  {
    tableName: "TienIch",
    timestamps: false, // Không có createdAt & updatedAt
  }
);

module.exports = TienIch;