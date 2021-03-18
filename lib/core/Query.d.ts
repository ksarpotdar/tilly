import { Column } from './Column';
import { Operator, Row } from './types';
import { Table } from './Table';
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export declare class Query {
    private readonly source;
    private readonly operator;
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
     */
    constructor(source: Query | Table, operator: Operator<number>);
    /**
     * Creates a query to furthre filter the contents of the query based on another predicate.
     * @param operator An Operator object that creates the filter predicate at query execution time.
     */
    where(operator: Operator<number>): Query;
    /**
     * Tests the query to see if it contains any result rows.
     */
    exists(): boolean;
    /**
     * Returns the indexes of all rows in the query with an optional filter criteria.
     * @private
     */
    indexes(operator?: Operator<number>): Iterable<number>;
    /**
     * Selects many rows of data.
     */
    select(...columns: Array<Column>): Iterable<Row>;
}
