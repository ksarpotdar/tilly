"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// load zipped JSON from a file
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const json = JSON.parse(zlib_1.brotliDecompressSync(fs_1.readFileSync(process.argv[2])).toString('utf-8')); // improve read/unzip time with streams? 
// example really starts here
const core_1 = require("../core");
// load the database and table from file
const estimates = new core_1.Table(json);
// for conveniance, find the columns we are interested in; some aliased
const countryCode = estimates.columns.find(column => column.name === 'Country Code');
const countryName = estimates.columns.find(column => column.name === 'Country Name');
const indicatorName = estimates.columns.find(column => column.name === 'Indicator Name');
const value = estimates.columns.find(column => column.name === '2020').as('population').to(Number);
// a query to filter our country codes that are not countries
const countries = estimates.where(core_1.not(countryCode.in(['ARB', 'CSS', 'CEB', 'EAR', 'EAS', 'EAP', 'TEA', 'ECS', 'ECA', 'TEC', 'EUU', 'FCS', 'HPC', 'HIC', 'INX', 'LTE', 'EMU', 'LCN', 'LAC', 'TLA', 'LDC', 'LIC', 'LMY', 'LMC', 'MEA', 'MNA', 'TMN', 'MIC', 'NAC', 'OED', 'OSS', 'PSS', 'PST', 'PRE', 'SST', 'SAS', 'TSA', 'SSF', 'SSA', 'TSS', 'UMC', 'WLD'])));
// create a query to home in just on population data
const query = countries.where(core_1.and(indicatorName.equals('Population, total'), core_1.not(value.equals(null))));
// iterate the query results
for (const row of query.select(countryCode.as('code'), countryName.as('name'), value)) {
    console.log(row);
}
let count = 0;
const start = process.hrtime();
// iterate the query results - without console overhead
for (const row of query.select()) {
    count++;
}
const elapsed = process.hrtime(start);
console.log(`Returned ${count} rows from ${countryCode.count()} in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`);
