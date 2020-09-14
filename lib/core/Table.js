"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Column_1 = require("./Column");
const Key_1 = require("./Key");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table {
    constructor(p1) {
        if (typeof p1 === "string") {
            this.name = p1;
            this.columns = [];
            this.rows = 0;
        }
        else {
            this.name = p1.name;
            this.columns = p1.columns.map((column) => Table.create(column));
            this.rows = p1.rows;
        }
    }
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns) {
        for (const column of columns) {
            // if the table already has rows, add null rows to the newly added columns
            if (this.rows !== 0) {
                column.insert(null, this.indexes());
            }
            // add the columns to the table
            this.columns.push(column);
        }
    }
    /**
     * Adds a new row of data to the table
     * @param rows One or more rows of data to add
     */
    insert(...rows) {
        for (const row of rows) {
            // add a new row with appropriate value, or null if not found, to each column
            for (const column of this.columns) {
                column.insert(column.name in row ? row[column.name] : null, [this.rows]);
            }
            this.rows++;
        }
    }
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name) {
        return this.columns.find(col => col.name === name);
    }
    /**
     * Returns the indexes of all rows in the table.
     */
    *indexes() {
        for (let i = 0; i < this.rows; i++) {
            yield i;
        }
    }
    /**
     * Create columns from JSON objects
     * @param json The raw JSON to create columns from
     */
    static create(json) {
        switch (json.type) {
            case 'Key':
                return new Key_1.Key(json.name, json);
            default:
                return new Column_1.Column(json.name, json);
        }
    }
}
exports.Table = Table;
