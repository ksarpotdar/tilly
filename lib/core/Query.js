"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
class Query {
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     */
    constructor(source) {
        this.source = source;
        this.operator = () => (index) => true;
        this.columns = [];
    }
    /**
     * Defines the columns that will be returned by this query.
     * @param columns The set of columns from the underlying soure that will be returned by this query.
     * @return Fluent API call, so returns this.
     */
    select(...columns) {
        this.columns = columns;
        return this;
    }
    /**
     * Defines the filter critera that will be applied to rows retrieved from the source.
     * @param operator The predicate built using the supplied column oriented predicates ([[equals]], [[in]], [[and]], [[or]], etc.).
     * @return Fluent API call, so returns this.
     */
    where(operator) {
        this.operator = operator;
        return this;
    }
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name) {
        return this.columns.find(col => col.name === name);
    }
    /**
     * Returns the row indexes that this query will return when executed.
     * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
     */
    *indexes() {
        // generate the predicate that will be used to filter the rows.
        const predicate = this.operator();
        // filter the rows
        for (const index of this.source.indexes()) {
            if (predicate(index)) {
                yield index;
            }
        }
    }
    /**
     * Makes the query iterable.
     * @returns Returns an interable iterator to the result rows.
     */
    *[Symbol.iterator]() {
        for (const index of this.indexes()) {
            const row = {};
            // create each row in the result
            for (const column of this.columns) {
                row[column.name] = column.value(index);
            }
            yield row;
        }
    }
}
exports.Query = Query;
