"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Column_1 = require("./Column");
const Key_1 = require("./Key");
const Queryable_1 = require("./Queryable");
const Query_1 = require("./Query");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table extends Queryable_1.Queryable {
    constructor(p1) {
        super();
        if (typeof p1 === "string") {
            this.name = p1;
            this.columns = [];
            this.rows = 0;
        }
        else {
            this.name = p1.name;
            this.columns = p1.columns.map((json) => 'index' in json ? new Column_1.Column(json.name, json) : new Key_1.Key(json.name, json));
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
    row(index, ...columns) {
        return super.row(index, ...(columns.length === 0 ? this.columns : columns));
    }
    /**
     * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
     * @param columns The columns to return in each row; if not provided, all columns will be returned.
     */
    select(...columns) {
        return super.select(...(columns.length === 0 ? this.columns : columns));
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
        for (let i = 0; i < this.rows; ++i) {
            if (predicate(i)) {
                yield i;
            }
        }
    }
}
exports.Table = Table;
