"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queryable = void 0;
/**
 * Abstract representation of a queryable object that is an iterator over a number of rows.
 */
class Queryable {
    constructor(queryable = undefined) {
        if (queryable) {
            this.source = queryable.indices();
        }
    }
    /**
     * Executes the query, returning results as a series of rows.
     * @returns Returns an interable iterator to the result rows.
     */
    *run() {
        for (const index of this.indices()) {
            const row = {};
            // create each row in the result
            for (const column of this.columns()) {
                row[column.name] = column.value(index);
            }
            yield row;
        }
    }
    /**
     * Makes the queryable object itself iterable.
     */
    [Symbol.iterator]() {
        return this.run();
    }
}
exports.Queryable = Queryable;
