var mysql = require("mysql");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "sdiaryproject", //db명
});
module.exports = db;
