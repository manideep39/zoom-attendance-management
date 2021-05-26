const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.post("/upload", upload.single("zoomRecord"), (req, res) => {
  console.log(req.file);
  res.send("file uploaded");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// const { readCSV } = require("./utils/readCSV.js");

// const data = readCSV("data.csv");

// console.log(data);
