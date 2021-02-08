"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.Table = void 0;
const Column_1 = require("./Column");
const Key_1 = require("./Key");
const operators_1 = require("./operators");
/**
 * Internal base class for tables and queries.
 * @private
 */
class Queryable {
    where(operator) {
        return new Query(this, operator);
    }
    row(index, ...columns) {
        const result = {};
        for (const column of columns) {
            result[column.name] = column.value(index);
        }
        return result;
    }
    *select(...columns) {
        for (const index of this.indexes(undefined)) {
            yield this.row(index, ...columns);
        }
    }
}
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table extends Queryable {
    constructor(p1) {
        super();
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
                column.insert(null, this.indexes(undefined));
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
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
class Query extends Queryable {
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
     */
    constructor(source, operator) {
        super();
        this.source = source;
        this.operator = operator;
    }
    /**
     * Returns the indexes of all rows in the query with an optional filter criteria.
     * @private
     */
    indexes(operator) {
        return this.source.indexes(operator ? operators_1.and(operator, this.operator) : this.operator);
    }
}
exports.Query = Query;
