const Sequelize = require("sequelize")
require("dotenv").config()

//khai báo server sqlsql
const sequelizeConnect = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
    host: process.env.DB_HOST,
    dialect:"mssql",
    debug: true,
    port: process.env.DB_PORT,
    dialectOptions: {
        encrypt: true,
    }
}
)

//kiểm tra kết nốinối
sequelizeConnect.authenticate()
.then(()=> console.log("connection successful"))
.catch((err)=> console.log("connection failed ====> ",err))

module.exports = sequelizeConnect