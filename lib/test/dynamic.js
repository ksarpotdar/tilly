"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
// some names to generate a membership database with
const givenNames = ['Boris', 'Theresa', 'David', 'Gordon', 'Tony', 'John', 'Margaret', 'James', 'Harold', 'Edward'];
const familyNames = ['Johnson', 'May', 'Cameron', 'Brown', 'Blair', 'Major', 'Thatcher', 'Callaghan', 'Wilson', 'Heath'];
const counties = ['Cambridgeshire', 'East Sussex', 'Essex', 'Kent', 'Suffolk', 'West Sussex'];
// return a random entry from an array of strings
function random(strings) {
    return strings[Math.floor(Math.random() * strings.length)];
}
// create a table with some columns
const membership = new core_1.Table('membership');
const id = membership.add(new core_1.Column('id'));
const givenName = membership.add(new core_1.Column('givenName'));
const familyName = membership.add(new core_1.Column('familyName'));
// populate the table with some random data
for (let id = 0; id < 10; id++) {
    membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) });
}
const county = membership.add(new core_1.Column('county').to(c => c || "Not specified"));
// populate the table with some random data
for (let id = 10; id < 20; id++) {
    membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) });
}
const sussex = new core_1.Query(membership)
    .select(id, givenName, familyName, county)
    .where(givenName.list('David', 'James'));
for (const member of sussex) {
    console.log(member);
}
console.log();
