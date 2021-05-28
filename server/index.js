const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

// set destination and name for the file.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".csv");
  },
});
const upload = multer({ storage: storage });

const processData = require("./utils/processData.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.post("/upload", upload.single("zoomRecord"), (req, res) => {
  const summary = processData();
  res.send("file uploaded");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
