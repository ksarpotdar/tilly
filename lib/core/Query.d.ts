import { Queryable } from './Queryable';
import { Column } from './Column';
import { Predicate } from './types';
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export declare class Query extends Queryable {
    private readonly source;
    /**
     * The predicate that this query will use to restrict the number of rows from source table.
     */
    private predicate;
    /**
     * The columns that will be returned by this query.
     */
    private allColumns;
    /**
     * Created a new instance of the query class.
     * @param queryable Another queryable object to use as the source for this query.
     */
    constructor(source: Queryable);
    /**
     * Defines the columns that will be returned by this query.
     * @param columns The set of columns from the underlying soure that will be returned by this query.
     */
    select(...columns: Column[]): this;
    /**
     * Defines the filter critera that will be applied to rows retrieved from the source.
     * @param predicate A boolean predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
     */
    where(predicate: Predicate<number>): this;
    /**
     * Returns the set of columns that this query will return when executed.
     */
    columns(): Iterable<Column>;
    /**
     * Returns the row indices that this query will return when executed.
     */
    indices(): Iterable<number>;
}
