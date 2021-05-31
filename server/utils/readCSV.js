const parse = require("csv-parse/lib/sync");
const fs = require("fs");

function readCSV(filename, cast) {
  if (!fs.existsSync(filename)) {
    console.log("File does not exist");
    return false;
  }

  const csvString = fs.readFileSync(filename, "utf-8");
  const records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
    cast_date: true,
    cast,
  });

  return records;
}

module.exports = readCSV;
