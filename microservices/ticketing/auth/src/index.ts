import express from "express";

const app = express();

app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("hi there");
});

app.listen(4000, () => console.log("Listening on port 4000 (auth)!"));
