import {Table, Column, Query, or} from '../core';

// some names to generate a membership database with
const givenNames = ['Boris', 'Theresa', 'David', 'Gordon', 'Tony', 'John', 'Margaret', 'James', 'Harold', 'Edward'];
const familyNames = ['Johnson', 'May', 'Cameron', 'Brown', 'Blair', 'Major', 'Thatcher', 'Callaghan', 'Wilson', 'Heath'];
const counties = ['Cambridgeshire', 'East Sussex', 'Essex', 'Kent', 'Suffolk', 'West Sussex'];

// return a random entry from an array of strings
function random(strings: Array<string>): string {
	return strings[Math.floor(Math.random() * strings.length)];
}

// create a table with some columns
const membership = new Table('membership');
const id = membership.add(new Column('id'));
const givenName = membership.add(new Column('givenName'));
const familyName = membership.add(new Column('familyName'));
const county = membership.add(new Column('county').default("Not Specified"));

// populate the table with some random data
for (let id = 0; id < 10; id++) {
	membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) })
}

const sussex = new Query(membership)
	.select(id, givenName, familyName, county)
	.where(or(givenName.equals('David'), givenName.equals('James')));

for (const member of sussex) {
	console.log(member);
}

console.log()