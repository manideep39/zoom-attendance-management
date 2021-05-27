const fs = require("fs");
const path = require("path");

function processData(data) {
  fs.unlinkSync(path.join(__dirname, "../uploads/zoomRecord.csv"), (err) =>
    console.error(err)
  );

  console.log(data);
}

module.exports = processData;
