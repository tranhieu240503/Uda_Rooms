const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Posts = sequelize.define(
  "Posts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "chờ duyệt",
    },
    loaiPost: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "tìm kiếm phòng trọ",
    },
  },
  {
    timestamps: true,
    tableName: "Posts",
  }
);

module.exports = Posts;