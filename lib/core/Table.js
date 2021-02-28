"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Column_1 = require("./Column");
const Query_1 = require("./Query");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table {
    constructor(p1) {
        this.name = typeof p1 === "string" ? p1 : p1.name;
        this.columns = typeof p1 === "string" ? [] : p1.columns.map(col => new Column_1.Column(col.name, col));
        this.rows = typeof p1 === "string" ? 0 : p1.rows;
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
    row(index, ...columns) {
        return Object.fromEntries((columns.length ? columns : this.columns).map(column => [column.name, column.value(index)]));
    }
    /**
     * Returns the number of rows within the column.
     */
    count() {
        return this.rows;
    }
    /**
     * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
     * @param columns The columns to return in each row; if not provided, all columns will be returned.
     */
    *select(...columns) {
        for (const index of this.indexes()) {
            yield this.row(index, ...columns.length ? columns : this.columns);
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
