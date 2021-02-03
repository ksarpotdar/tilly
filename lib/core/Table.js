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
            this.columns = p1.columns.map((json) => 'distinct' in json ? new Column_1.Column(json.name, json) : new Key_1.Key(json.name, json));
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
     * @param data The row of data to add
     * @returns Returns the row index within the table
     */
    insert(row) {
        // add a new row with appropriate value, or null if not found, to each column
        for (const column of this.columns) {
            column.insert(column.name in row ? row[column.name] : null, [this.rows]);
        }
        return this.rows++;
    }
    /**
     * Gets a row for a given index.
     * @param index The index of the row.
     * @return Returns the row of data
     */
    row(index) {
        const result = {};
        // create each row in the result
        for (const column of this.columns) {
            result[column.name] = column.value(index);
        }
        return result;
    }
    /**
     * Returns the indexes of all rows in the table.
     */
    *indexes() {
        for (let i = 0; i < this.rows; i++) {
            yield i;
        }
    }
}
exports.Table = Table;
