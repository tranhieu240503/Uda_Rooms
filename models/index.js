

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Users = require("./Users");
const Posts = require("./Posts");
const Images = require("./PostImages");
const Comments = require("./Comments");
const NhaTro = require("./NhaTro");
const TienNghi = require("./TienNghi");
const TienIch = require("./TienIch");
const TienIchXungQuanh = require("./TienIchXungQuanh");
const TienNghiNhaTro = require("./TienNghiNhaTro");
const ThongTinThem = require("./ThongTinThem");
const ThongTinThemNhaTro = require("./ThongTinThemNhaTro");
const DanhGiaNhaTro = require("./DanhGiaNhaTro");

Posts.belongsTo(Users, { foreignKey: "user_id", as: "author" });
Posts.hasMany(Images, { foreignKey: "post_id", as: "images" });
Images.belongsTo(Posts, { foreignKey: "post_id", as: "post" });

Comments.hasMany(Comments, { foreignKey: "parent_id", as: "replies", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comments.belongsTo(Comments, { foreignKey: "parent_id", as: "parent", onDelete: "CASCADE", onUpdate: "CASCADE" });

Users.hasMany(Comments, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comments.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

Posts.hasMany(Comments, { foreignKey: "post_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comments.belongsTo(Posts, { foreignKey: "post_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

NhaTro.belongsToMany(TienNghi, { through: TienNghiNhaTro, foreignKey: "idNhaTro" });
TienNghi.belongsToMany(NhaTro, { through: TienNghiNhaTro, foreignKey: "idTienNghi" });

NhaTro.belongsToMany(ThongTinThem, { through: ThongTinThemNhaTro, foreignKey: "idNhaTro" });
ThongTinThem.belongsToMany(NhaTro, { through: ThongTinThemNhaTro, foreignKey: "idThongTinThem" });

NhaTro.hasMany(DanhGiaNhaTro, { foreignKey: "maNhaTro" });
DanhGiaNhaTro.belongsTo(NhaTro, { foreignKey: "maNhaTro" });

Users.hasMany(DanhGiaNhaTro, { foreignKey: "nguoiDanhGia" });
DanhGiaNhaTro.belongsTo(Users, { foreignKey: "nguoiDanhGia" });

TienIch.hasMany(TienIchXungQuanh, { foreignKey: "loai", onDelete: "CASCADE" });
TienIchXungQuanh.belongsTo(TienIch, { foreignKey: "loai", onDelete: "CASCADE" });

module.exports = {
  sequelize,
  Users,
  Posts,
  Images,
  Comments,
  NhaTro,
  TienNghi,
  TienIch,
  TienIchXungQuanh,
  TienNghiNhaTro,
  ThongTinThem,
  ThongTinThemNhaTro,
  DanhGiaNhaTro,
};