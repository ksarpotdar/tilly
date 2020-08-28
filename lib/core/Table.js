"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Column_1 = require("./Column");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table {
    constructor(p1) {
        if (typeof p1 === "string") {
            this.name = p1;
            this.columns = [];
            this.rowCount = 0;
        }
        else {
            this.name = p1.name;
            this.columns = p1.columns.map((column) => new Column_1.Column(column));
            this.rowCount = p1.rowCount;
        }
    }
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns) {
        // add the columns to the table
        this.columns.push(...columns);
        if (this.rowCount) {
            for (const column of columns) {
                // add empty entries for existing rows
                column.insert(null, range(0, this.rowCount));
            }
        }
    }
    /**
     * Adds a new row of data to the table
     * @param row The row of data to add
     */
    insert(row) {
        const start = this.rowCount++;
        for (const column of this.columns) {
            column.insert(row[column.name], range(start, this.rowCount));
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
    *indices() {
        let index = 0;
        while (index < this.rowCount) {
            yield index++;
        }
    }
}
exports.Table = Table;
function* range(start, end) {
    while (start < end) {
        yield start++;
    }
}
