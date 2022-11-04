const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);
  try {
    await axios.post("http://posts-clusterip-srv:4000/events", event);
    // await axios.post("http://localhost:4001/events", event);
    // await axios.post("http://localhost:4002/events", event);
    // await axios.post("http://localhost:4003/events", event);
  } catch (error) {
    console.log(error);
  }

  res.send(event);
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log("listening on 4005 (event bus)"));
