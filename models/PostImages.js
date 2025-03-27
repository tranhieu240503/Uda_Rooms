const { DataTypes, Sequelize } = require("sequelize"); // Import Sequelize alongside DataTypes
const sequelize = require("../config/db");

const Images = sequelize.define(
  "Images",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("GETDATE()"), // Use Sequelize.literal for SQL Server's GETDATE()
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt", // Explicitly map to the column name
    updatedAt: false, // Disable updatedAt
    tableName: "PostImages",
  }
);

module.exports = Images;