import { Column } from './Column';
import { Row } from './types';
/**
 * Abstract representation of a queryable object that is an iterator over a number of rows.
 */
export declare abstract class Queryable implements Iterable<Row> {
    /**
     * Returns the row indices of rows satisfying the query criteria.
     */
    abstract indices(): Iterable<number>;
    /**
     * The columns that will be returned in the rows returned by this query.
     */
    abstract columns(): Iterable<Column>;
    /**
     * Executes the query, returning results as a series of rows.
     * @returns Returns an interable iterator to the result rows.
     * @private
     */
    private run;
    /**
     * Makes the queryable object itself iterable.
     * @returns Returns an interable iterator to the result rows.
     */
    [Symbol.iterator](): IterableIterator<Row>;
}
