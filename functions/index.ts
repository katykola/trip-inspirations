import functions from "firebase-functions";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/fetch", async (req, res) => {
  const { url } = req.query;
  try {
    if (typeof url === "string") {
      const response = await axios.get(url);
      res.send(response.data);
    } else {
      res.status(400).send("Invalid URL");
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

exports.api = functions.https.onRequest(app);
