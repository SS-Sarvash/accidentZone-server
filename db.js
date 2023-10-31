const dotenv = require('dotenv');
dotenv.config()
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "12345",
  database: "test1",
  port: 5432,
  host: "localhost",
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// })

pool.connect((err)=>{
  if(err) throw err;
  console.log("Connect to pg vercel success!");
})
module.exports = pool;
