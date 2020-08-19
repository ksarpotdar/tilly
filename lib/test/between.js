"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
// create a table
const table = new core_1.Table('ranges');
const name = new core_1.Column('name');
const from = new core_1.Column('from');
const to = new core_1.Column('to');
table.add(name, from, to);
// create some data
for (let year = 1000; year < 3000; ++year) {
    table.insert({ name: `${year} - ${year + 5}`, from: new Date(year, 0, 1), to: new Date(year + 5, 11, 31) });
}
// create a query
const today = new Date();
const query1 = new core_1.Query(table)
    .where(core_1.or(from.equals(today), from.lessThan(today)));
const query2 = new core_1.Query(query1)
    .select(name)
    .where(to.evaluate(value => value >= today));
for (const row of query2) {
    console.log(row);
}
