import * as cdb from '../core';

// some names to generate a membership database with
const givenNames = ['Boris', 'Theresa', 'David', 'Gordon', 'Tony', 'John', 'Margaret', 'James', 'Harold', 'Edward'];
const familyNames = ['Johnson', 'May', 'Cameron', 'Brown', 'Blair', 'Major', 'Thatcher', 'Callaghan', 'Wilson', 'Heath'];
const counties = ['Cambridgeshire', 'East Sussex', 'Essex', 'Kent', 'Suffolk', 'West Sussex'];

// return a random entry from an array of strings
function random(strings: Array<string | undefined | null>): string | undefined | null {
	return strings[Math.floor(Math.random() * strings.length)];
}

// create a table with some columns
const membership = new cdb.Table('membership');
const id = membership.add(new cdb.Column('id'));
const givenName = membership.add(new cdb.Column('givenName'));
const familyName = membership.add(new cdb.Column('familyName'));

// populate the table with some random data
for (let id = 0; id < 10; id++) {
	membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) })
}

const county = membership.add(new cdb.Column('county').default("Not Specified"));

for (let id = 10; id < 20; id++) {
	membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) })
}

const sussex = new cdb.Query(membership)
	.select(id, givenName, familyName, county)
	//.where(givenName.equals('David'));

for (const member of sussex) {
	console.log(member);
}
