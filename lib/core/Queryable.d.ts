import { Column } from './Column';
import { Row } from './Row';
/**
 * Abstract representation of a queryable object that is an iterator over a number of rows.
 */
export declare abstract class Queryable implements Iterable<Row> {
    protected source: Iterable<number> | undefined;
    /**
     * Returns the row indices of rows satisfying the query criteria.
     * @private Using the absence of a protection modifier to mean package private as Java.
     */
    protected abstract indices(): Iterable<number>;
    /**
     * The columns that will be returned in the rows returned by this query.
     */
    protected abstract columns(): Iterable<Column>;
    constructor(queryable?: Queryable | undefined);
    /**
     * Executes the query, returning results as a series of rows.
     * @returns Returns an interable iterator to the result rows.
     */
    private run;
    /**
     * Makes the queryable object itself iterable.
     */
    [Symbol.iterator](): IterableIterator<Row>;
}
