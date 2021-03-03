"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Column_1 = require("./Column");
const Query_1 = require("./Query");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table {
    /**
     * Creates a new instance of the Table class.
     * @param name The name of the table.
     * @param table Another table to copy as a baseline or JSON rendering of a table.
     */
    constructor(name, table) {
        this.name = name;
        this.columns = table ? table.columns.map(column => new Column_1.Column(column.name, column)) : [];
    }
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns) {
        for (const column of columns) {
            // pre-populate with nulls for existing rows
            column.insert(null, this.indexes());
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
        const range = [this.rows];
        // add a new row with appropriate value, or null if not found, to each column
        for (const column of this.columns) {
            column.insert(row[column.name] || null, range);
        }
    }
    /**
     * Returns the number of rows within the table.
     */
    get rows() {
        return this.columns[0] ? this.columns[0].index.length : 0;
    }
    /**
     * Gets a row for a given index.
     * @param index The index of the row.
     * @return Returns the row of data
     */
    row(index) {
        return Object.fromEntries(this.columns.map(column => [column.name, column.value(index)]));
    }
    /**
     * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
     */
    *select() {
        for (const index of this.indexes()) {
            yield this.row(index);
        }
    }
    /**
     * Creates a query to filter the contents of a table based on a predicate.
     * @param operator An Operator object that creates the filter predicate at query execution time.
     */
    where(operator) {
        return new Query_1.Query(this, operator);
    }
    /**
     * Returns the indexes of all rows in the table with an optional filter criteria.
     * @private
     */
    *indexes(operator) {
        const predicate = operator ? operator() : () => true;
        for (let i = 0, l = this.rows; i < l; ++i) {
            if (predicate(i)) {
                yield i;
            }
        }
    }
}
exports.Table = Table;
