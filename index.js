const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const port = process.env.PORT;
var lati,longi;
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
      // console.log("lat: "+lat+" long: "+long+" acc: "+accuracy);
      console.log("lat: "+lat+" long: "+long);
      lati=lat;
      longi=long;
      res.send("data received successfully");// due to this response sending , the server wont halt in receiving data;
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/detect", async (req, res) => {
    try {
      const { code } = req.body;
      console.log("code: " + code);
      // const { lat, long } = code; 
      const storedCoordinates = await pool.query("SELECT * FROM storedData;");
      let foundWithinRange = false;
      storedCoordinates.rows.forEach((coord) => {
          const distanceInMeters = distance(lati, coord.latitude, longi, coord.longitude);
          console.log("distance: "+distanceInMeters);
          if (distanceInMeters <= 50) {
            console.log("distance within 50: "+distanceInMeters);
              foundWithinRange = true;
          }
      });
      if (!foundWithinRange) {
          await pool.query(
              `INSERT INTO storedData(title, latitude, longitude) VALUES('New Zone', $1, $2);`,
              [lati, longi]
          );
          res.send("Coordinate inserted successfully.");
      } else {
          res.send("A coordinate was found within 50 meters. No insert operation performed.");
      }
    } catch (error) {
      console.log(error);
    }
  });



// JavaScript program to calculate Distance Between
// Two Points on Earth

function distance(lat1, lat2, lon1, lon2) {

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula 
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956 
  // for miles
  let r = 6371;

  // calculate the result in kilometers
  let distanceInKilometers = c * r;

  // convert kilometers to meters
  let distanceInMeters = distanceInKilometers * 1000;

  // return the result in meters
  return distanceInMeters;
}



app.listen(port, () => {
    console.log(`Server is running on port${port}`);
  });