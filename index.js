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

  app.get("/getstoreddata", async (req, res) => {
    try {
      const qry = await pool.query("SELECT * FROM storedData;");
      res.json(qry.rows);      
       
    } catch (err) {
      console.log(err.message);
    }
  });

app.post("/postdata", async (req, res) => {
    try {
      const { status, latitude, longitude } = req.body;
      console.log(status);
      const qry = await pool.query(
        `INSERT INTO accidentZone(status, latitude, longitude) values($1,$2,$3)`,
        [status, latitude, longitude]
      );
      res.json(qry);
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/poster", async (req, res) => {
    try {
      const { lat, long, accuracy } = req.body;
      console.log("lat: "+lat+" long: "+long+" acc: "+accuracy);
      res.send("data received successfully");// due to this response sending , the server wont halt in receiving data;
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/detect", async (req, res) => {
    try {
      const { code } = req.body;
      console.log("code: "+code);
      res.send("data received successfully");// due to this response sending , the server wont halt in receiving data;
    } catch (error) {
      console.log(error);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port${port}`);
  });