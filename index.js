const csv = require("csv-parser");
const fs = require("fs");
const records = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    records.push(row);
  })
  .on("end", () => {
    processRecords(records);
    console.log("CSV file successfully processed");
  });

function processRecords(records) {
  console.log(records);
}
