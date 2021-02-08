import { Operator, Row } from './types';
import { IColumn } from './IColumn';
/**
 * Internal base class for tables and queries.
 * @private
 */
declare abstract class Queryable {
    abstract indexes(operator: Operator | undefined): Iterable<number>;
    where(operator: Operator): Query;
    row(index: number, ...columns: Array<IColumn>): Row;
    select(...columns: Array<IColumn>): Iterable<Row>;
}
/**
 * Represents a table of data, comprising a number of columns.
 */
export declare class Table extends Queryable {
    /**
     * The name of this table
     */
    readonly name: string;
    /**
     * The number of rows inserted into the table.
     * @private
     */
    private rows;
    /**
     * All the columns within the table.
     */
    readonly columns: Array<IColumn>;
    /**
     * Creates a new instance of the Table class.
     * @param name The name of the table.
     */
    constructor(name: string);
    /**
     * Creates a new instance of the Table class.
     * @param table Another table to copy as a baseline or JSON rendering of a table.
     */
    constructor(table: Table);
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns: Array<IColumn>): void;
    /**
     * Adds a new row of data to the table
     * @param data The row of data to add
     * @returns Returns the row index within the table
     */
    insert(row: Row): number;
    /**
     * Gets a row for a given index.
     * @param index The index of the row.
     * @return Returns the row of data
     */
    row(index: number, ...columns: Array<IColumn>): Row;
    /**
     * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
     * @param columns The columns to return in each row; if not provided, all columns will be returned.
     */
    select(...columns: Array<IColumn>): Iterable<Row>;
    /**
     * Returns the indexes of all rows in the table with an optional filter criteria.
     * @private
     */
    indexes(operator: Operator | undefined): Iterable<number>;
}
/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export declare class Query extends Queryable {
    private readonly source;
    private readonly operator;
    /**
     * Created a new instance of the query class.
     * @param source Another queryable object to use as the source for this query.
     * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
     */
    constructor(source: Queryable, operator: Operator);
    /**
     * Returns the indexes of all rows in the query with an optional filter criteria.
     * @private
     */
    indexes(operator: Operator | undefined): Iterable<number>;
}
export {};
