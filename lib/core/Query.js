"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const Queryable_1 = require("./Queryable");
const operators_1 = require("./operators");
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
class Query extends Queryable_1.Queryable {
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
    where(operator) {
        return new Query(this, operator);
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
