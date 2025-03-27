const { DataTypes,Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullname: {  // Thêm trường fullname
    type: DataTypes.STRING,
    allowNull: true,  // Cho phép null nếu không có giá trị
  },
  avatar: {  // Thêm trường avatar
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {  // Thêm trường phone
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {  // Thêm trường gender
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {  // Thêm trường role
    type: DataTypes.INTEGER,  // Ví dụ, bạn có thể sử dụng kiểu INTEGER cho role (1 là admin, 2 là user, v.v.)
    allowNull: true,
    defaultValue: 2,  // Mặc định là user
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("GETDATE()")
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("GETDATE()"),
  }

}, {
  timestamps: true,
});





// Export đúng cách
module.exports = Users;


