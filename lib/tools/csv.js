"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const fs_1 = require("fs");
const csv = require("csv-parser");
const bom = require("strip-bom-stream");
// create an empty database and table structure
const table = new core_1.Table('table');
let count = 0;
let start = new Date();
/** Add the columns once csv-parser has parsed the headers */
function createColumns(headers) {
    for (const name of headers) {
        table.add(new core_1.Column(name));
    }
}
/** Add each row to the table */
function insertRow(row) {
    for (const name of Object.getOwnPropertyNames(row)) {
        if (row[name] === '') {
            row[name] = null;
        }
    }
    table.insert(row);
    if (++count % 1000 === 0) {
        const end = new Date();
        console.log(`Processed ${count} rows in ${(end.getTime() - start.getTime()) / 1000}s`);
    }
}
/** Write the target file */
function writeJSON() {
    const end = new Date();
    console.log(`Processed ${count} rows in ${(end.getTime() - start.getTime()) / 1000}s`);
    fs_1.writeFile(process.argv[3], JSON.stringify(table), () => {
        const end = new Date();
        console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
    });
}
fs_1.createReadStream(process.argv[2]).pipe(bom()).pipe(csv()).on('headers', createColumns).on('data', insertRow).on('end', writeJSON);
