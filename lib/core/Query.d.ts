import { Column } from './Column';
import { Table } from './Table';
import { Supplier, Predicate, Row } from './types';
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export declare class Query {
    private readonly source;
    /**
     * The supplier that will create the predicate that this query will use to restrict the number of rows from source table.
     * @private
     */
    private condition;
    /**
     * The columns that will be returned by this query.
     */
    columns: Array<Column>;
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
    select(...columns: Column[]): this;
    /**
     * Defines the filter critera that will be applied to rows retrieved from the source.
     * @param condition The predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
     * @return Fluent API call, so returns this.
     */
    where(condition: Supplier<Predicate<number>>): this;
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name: string): Column | undefined;
    /**
     * Returns the row indexes that this query will return when executed.
     * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
     */
    indexes(): IterableIterator<number>;
    /**
     * Makes the query iterable.
     * @returns Returns an interable iterator to the result rows.
     */
    [Symbol.iterator](): IterableIterator<Row>;
}
