const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Comments = sequelize.define(
  "Comments",
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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "chưa sửa", // Khi tạo mới bình luận
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
    tableName: "Comments",
  }
);

module.exports = Comments;
