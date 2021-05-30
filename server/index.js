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

const generateSummary = require("./utils/processEvalData.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.post(
  "/api/upload",
  upload.fields([
    { name: "zoomRecord", maxCount: 1 },
    { name: "batchRecord", maxCount: 1 },
  ]),
  (req, res) => {
    const { recordCategory } = req.body;
    switch (recordCategory) {
      case "evaluation":
        res.send(JSON.stringify({ error: false }));
        break;
      case "standup":
        break;
    }
  }
);

app.get("/api/getSummary", (req, res) => {
  const summary = generateSummary();
  res.send(JSON.stringify(summary));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
