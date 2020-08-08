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
const countryCode = estimates.column('Country Code');
const countryName = estimates.column('Country Name');
const indicatorName = estimates.column('Indicator Name');
const value = estimates.column('2020').as('population').to(Number); // NOTE: "as" and "to" can be used here or in query; they are not fluent and create new virtual columns
// a list of country codes in the data that are not countries, but aggregates
const notCountry = ['ARB', 'CSS', 'CEB', 'EAR', 'EAS', 'EAP', 'TEA', 'ECS', 'ECA', 'TEC', 'EUU', 'FCS', 'HPC', 'HIC', 'INX', 'LTE', 'EMU', 'LCN', 'LAC', 'TLA', 'LDC', 'LIC', 'LMY', 'LMC', 'MEA', 'MNA', 'TMN', 'MIC', 'NAC', 'OED', 'OSS', 'PSS', 'PST', 'PRE', 'SST', 'SAS', 'TSA', 'SSF', 'SSA', 'TSS', 'UMC', 'WLD'];
// create a query with just three returned columns and a complex filter criteria
const query = new core_1.Query(estimates)
    .select(countryCode.as('code'), countryName.as('name'), value)
    .where(core_1.and(indicatorName.equals('Population, total'), core_1.not(value.equals(null)), core_1.not(countryCode.list(...notCountry))));
// iterate the query results
for (const row of query) {
    console.log(row);
}
