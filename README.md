# Tilly
Tilly is a simple columnar database that can be used within the browser, or server-side in node.js. Stores the distinct values for each column and rows become integer indexes into the set of distinct values.

[![Maintainability](https://api.codeclimate.com/v1/badges/a0cbfd497a54ac1fb031/maintainability)](https://codeclimate.com/github/steelbreeze/tilly/maintainability)

## Installation
Until the first release, use the contents of the ```lib``` directory, the entery point is ```index.js```.
Run `npm update` after downloading to install dependencies.

## Use
There are two main ways to add data to a table:
1. Dynamically create ```Tables``` and ```Columns```, then add ```Rows```.
2. Load a JSON file of previously saved data.

Both options then allow you to query tables.

For option 2 above, a utility is provided to convert CSV formatted data into the Tilly JSON format. To run this utility, simply invoke the command:
```
node lib/tools/csv [source CSV path] [target JSON path]
```
Then compress the file with the following:
```
node lib/tools/compress [source JSON path] brotli
```
## Example
An example of option two would be:
```TypeScript
import { readFileSync } from 'fs';
import { brotliDecompressSync } from 'zlib';
import { Table, and, not } from '../core';

// read and uncompress source data
const json = JSON.parse(brotliDecompressSync(readFileSync(process.argv[2])).toString('utf-8'));

// load the database and table from file
const estimates = new Table(json);

// for conveniance, find the columns we are interested in; some aliased
const countryCode = estimates.columns.find(column => column.name === 'Country Code')!;
const countryName = estimates.columns.find(column => column.name === 'Country Name')!;
const indicatorName = estimates.columns.find(column => column.name === 'Indicator Name')!;
const value = estimates.columns.find(column => column.name === '2020')!.as('population').to(Number);

// a query to filter our country codes that are not countries
const countries = estimates.where(not(countryCode.in(['ARB', 'CSS', 'CEB', 'EAR', 'EAS', 'EAP', 'TEA', 'ECS', 'ECA', 'TEC', 'EUU', 'FCS', 'HPC', 'HIC', 'INX', 'LTE', 'EMU', 'LCN', 'LAC', 'TLA', 'LDC', 'LIC', 'LMY', 'LMC', 'MEA', 'MNA', 'TMN', 'MIC', 'NAC', 'OED', 'OSS', 'PSS', 'PST', 'PRE', 'SST', 'SAS', 'TSA', 'SSF', 'SSA', 'TSS', 'UMC', 'WLD'])));

// create a query to home in just on population data
const query = countries.where(and(indicatorName.equals('Population, total'), not(value.equals(null))));

// iterate the query results and display
for (const row of query.select(countryCode.as('code'), countryName.as('name'), value)) {
	console.log(row);
}

// re-run the same query without the console overhead for timings
let count = 0;
const start = process.hrtime();

for (const row of query.select(countryCode.as('code'), countryName.as('name'), value)) {
	count++;
}

const elapsed = process.hrtime(start);

console.log(`Returned ${count} rows from ${countryCode.count()} in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`);
```
The results of which is :
```
{ code: 'AFG', name: 'Afghanistan', population: 38928000 }
{ code: 'ALB', name: 'Albania', population: 2850000 }
...
{ code: 'ZMB', name: 'Zambia', population: 18384000 }
{ code: 'ZWE', name: 'Zimbabwe', population: 14863000 }

Returned 212 rows from 45325 in 0s 2.425424ms
```
This example uses population forecast data from the World Bank available [here](https://datacatalog.worldbank.org/dataset/health-nutrition-and-population-statistics). Performance based on a 2019 MacBook Pro 2.3GHz 8-core Intel Core i9.

## Licence
Licensed under the [MIT License](LICENSE).

## Depencencies
@steelbreeze/tilly depends on the following packages:
|Package|Use|Licence|
|:-|:-|:-|
|[csv-parser](https://github.com/mafintosh/csv-parser)|Stream parser for CSV files. Not a requirement for the core code, but used within the CSV to JSON conversion tool.|MIT License|
|[strip-bom-stream](https://github.com/sindresorhus/strip-bom-stream)|Removes byte order marks from files. Not a requirement for the core code, but used within the CSV to JSON conversion tool.|MIT License|
