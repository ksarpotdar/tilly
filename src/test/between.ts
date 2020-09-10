import { Table, Column, Query, evaluate } from '../core';

// create a table
const table = new Table('ranges');
const name = new Column('name');
const from = new Column('from');
const to = new Column('to');
table.add(name, from, to);

// create some data
for (let year = 1000; year < 3000; ++year) {
	table.insert({ name: `${year} - ${year + 5}`, from: new Date(year, 0, 1), to: new Date(year + 5, 11, 31) });
}

// create a query
const today = new Date();
const query1 = new Query(table)
	.where(evaluate(from, value => value <= today));

const query2 = new Query(query1)
	.select(name)
	.where(evaluate(to, value => value >= today));

for (const row of query2) {
	console.log(row);
}
