import { IColumn } from './IColumn';
import { Table } from './Table';
import { Operator, Row } from './types';
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export declare class Query {
    private readonly source;
    /**
     * The operator that will create the predicate that this query will use to restrict the number of rows from source table.
     * @private
     */
    private operator;
    /**
     * The columns that will be returned by this query.
     */
    columns: Array<IColumn>;
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     */
    constructor(source: Table | Query);
    /**
     * Defines the columns that will be returned by this query.
     * @param columns The set of columns from the underlying soure that will be returned by this query.
     * @return Fluent API call, so returns this.
     */
    select(...columns: Array<IColumn>): this;
    /**
     * Defines the filter critera that will be applied to rows retrieved from the source.
     * @param operator The predicate built using the supplied column oriented predicates ([[equals]], [[in]], [[and]], [[or]], etc.).
     * @return Fluent API call, so returns this.
     */
    where(operator: Operator): this;
    /**
     * Returns the row indexes that this query will return when executed.
     * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
     */
    indexes(): IterableIterator<number>;
    /**
     * Checks a query to see if there are any results.
     * @returns Returns true if a query has results.
     */
    exists(): boolean;
    /**
     * Makes the query iterable.
     * @returns Returns an interable iterator to the result rows.
     */
    [Symbol.iterator](): IterableIterator<Row>;
}
