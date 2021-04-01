import { Row, Column, Table } from "../core";
import { createReadStream, writeFile } from 'fs';

import csv = require('csv-parser');
import bom = require('strip-bom-stream');

// create an empty database and table structure
const table = new Table('table');

let count = 0;
const start: Date = new Date();

/** Add the columns once csv-parser has parsed the headers */
function createColumns(headers: any) {
	for (const name of headers) {
		table.add(new Column(name));
	}
}

/** Add each row to the table */
function insertRow(row: Row) {
	for (const name of Object.getOwnPropertyNames(row)) {
		if (row[name] === '') {
			row[name] = undefined;
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

	writeFile(process.argv[3], JSON.stringify(table), () => {
		const end = new Date();

		console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
	});
}

createReadStream(process.argv[2]).pipe(bom()).pipe(csv()).on('headers', createColumns).on('data', insertRow).on('end', writeJSON);
