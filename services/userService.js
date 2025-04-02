const Users = require("../models/Users");

const getUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
      attributes: ["id", "fullname", "avatar", "password","role"],
    });

    return user || null;
  } catch (error) {
    console.error("Lỗi truy vấn getUserByEmail:", error);
    throw error;
  }
};

module.exports = { getUserByEmail };
