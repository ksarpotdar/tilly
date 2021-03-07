"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const operators_1 = require("./operators");
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
class Query {
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
     */
    constructor(source, operator) {
        this.source = source;
        this.operator = operator;
    }
    /**
     * Creates a query to furthre filter the contents of the query based on another predicate.
     * @param operator An Operator object that creates the filter predicate at query execution time.
     */
    where(operator) {
        return new Query(this, operator);
    }
    /**
     * Tests the query to see if it contains any result rows.
     */
    exists() {
        return !this.indexes()[Symbol.iterator]().next().done;
    }
    /**
     * Selects many rows of data.
     */
    *select(...columns) {
        for (const index of this.source.indexes(this.operator)) {
            yield Object.fromEntries(columns.map(column => [column.name, column.value(index)]));
        }
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
