const fs = require("fs");
const path = require("path");

function removeFile() {
  fs.unlinkSync(path.join(__dirname, "../uploads/zoomRecord.csv"), (err) =>
    console.error(err)
  );
}

module.exports = removeFile;
