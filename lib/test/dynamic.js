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
// some names to generate a membership database with
const givenNames = ['Boris', 'Theresa', 'David', 'Gordon', 'Tony', 'John', 'Margaret', 'James', 'Harold', 'Edward'];
const familyNames = ['Johnson', 'May', 'Cameron', 'Brown', 'Blair', 'Major', 'Thatcher', 'Callaghan', 'Wilson', 'Heath'];
const counties = ['Cambridgeshire', 'East Sussex', 'Essex', 'Kent', 'Suffolk', 'West Sussex'];
// return a random entry from an array of strings
function random(strings) {
    return strings[Math.floor(Math.random() * strings.length)];
}
// create a table with some columns
const membership = new cdb.Table('membership');
const id = membership.add(new cdb.Column('id'));
const givenName = membership.add(new cdb.Column('givenName'));
const familyName = membership.add(new cdb.Column('familyName'));
// populate the table with some random data
for (let id = 0; id < 10; id++) {
    membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) });
}
const county = membership.add(new cdb.Column('county').default("Not Specified"));
for (let id = 10; id < 20; id++) {
    membership.insert({ id: id, givenName: random(givenNames), familyName: random(familyNames), county: random(counties) });
}
const sussex = new cdb.Query(membership)
    .select(id, givenName, familyName, county);
//.where(givenName.equals('David'));
for (const member of sussex) {
    console.log(member);
}
