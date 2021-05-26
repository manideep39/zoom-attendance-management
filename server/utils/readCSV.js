const parse = require("csv-parse/lib/sync");
const fs = require("fs");

function readCSV(filename) {
  const csvString = fs.readFileSync(filename, "utf-8");

  const records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
    cast_date: true,
    cast: true,
  });

  return records;
}

module.exports = { readCSV };
