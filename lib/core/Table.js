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
            this.rows = 0;
        }
        else {
            this.name = p1.name;
            this.columns = p1.columns.map((column) => new Column_1.Column(column));
            this.rows = p1.rows;
        }
    }
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns) {
        // add the columns to the table
        this.columns.push(...columns);
        // if the table already has rows, add null rows to the newly added columns
        if (this.rows) {
            for (const column of columns) {
                column.insert(null, this.indices());
            }
        }
    }
    /**
     * Adds a new row of data to the table
     * @param row The row of data to add
     */
    insert(row) {
        // add a new row with appropriate value, or null if not found, to each column
        for (const column of this.columns) {
            column.insert(row[column.name] || null, [this.rows]);
        }
        this.rows++;
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
        for (let i = 0; i < this.rows; i++) {
            yield i;
        }
    }
}
exports.Table = Table;
