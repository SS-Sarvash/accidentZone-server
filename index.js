const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.get("/getdata", async (req, res) => {
    try {
      const qry = await pool.query("SELECT * FROM accidentZone;");
      res.json(qry.rows);
    } catch (err) {
      console.log(err.message);
    }
  });

app.post("/postdata", async (req, res) => {
    try {
      const { Status, Latitude, Longitude } = req.body;
      const qry = await pool.query(
        `INSERT INTO accidentZone(Status, Latitude, Longitude) values($1,$2,$3)`,
        [Status, Latitude, Longitude]
      );
      res.json(qry);
    } catch (error) {
      console.log(error);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port${port}`);
  });