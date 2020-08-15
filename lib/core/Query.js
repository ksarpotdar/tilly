"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const Queryable_1 = require("./Queryable");
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
class Query extends Queryable_1.Queryable {
    /**
     * Created a new instance of the query class.
     * @param queryable Another queryable object to use as the source for this query.
     */
    constructor(source) {
        super();
        this.source = source;
        this.predicate = (index) => true;
        this.allColumns = [];
    }
    /**
     * Defines the columns that will be returned by this query.
     * @param columns The set of columns from the underlying soure that will be returned by this query.
     */
    select(...columns) {
        this.allColumns = columns;
        return this;
    }
    /**
     * Defines the filter critera that will be applied to rows retrieved from the source.
     * @param predicate A boolean predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
     */
    where(predicate) {
        this.predicate = predicate;
        return this;
    }
    /**
     * Returns the set of columns that this query will return when executed.
     */
    columns() {
        return this.allColumns;
    }
    /**
     * Returns the row indices that this query will return when executed.
     */
    *indices() {
        for (const index of this.source.indices()) {
            if (this.predicate(index)) { // TODO: use iterable protocol filter function
                yield index;
            }
        }
    }
}
exports.Query = Query;
