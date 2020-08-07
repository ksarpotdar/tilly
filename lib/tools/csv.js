"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cdb = __importStar(require("../core"));
const fs = __importStar(require("fs"));
const csv = require("csv-parser");
const bom = require("strip-bom-stream");
// create an empty database and table structure
const table = new cdb.Table('table');
let count = 0;
let start = new Date();
/** Add the columns once csv-parser has parsed the headers */
function createColumns(headers) {
    for (const name of headers) {
        table.add(new cdb.Column(name));
    }
}
/** Add each row to the table */
function insertRow(row) {
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
    fs.writeFile(process.argv[3], JSON.stringify(table), () => {
        const end = new Date();
        console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
    });
}
fs.createReadStream(process.argv[2]).pipe(bom()).pipe(csv()).on('headers', createColumns).on('data', insertRow).on('end', writeJSON);
