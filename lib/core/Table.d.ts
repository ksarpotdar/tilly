import { Queryable } from './Queryable';
import { Column } from './Column';
import { Row } from './types';
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
    private rowCount;
    /**
     * All the columns within the table.
     * @private
     */
    private readonly allColumns;
    /**
     * Creates a new instance of the Table class.
     * @param name The name of the table.
     */
    constructor(name: string);
    /**
     * Creates a new instance of the Table class.
     * @param table Another table to copy as a baseline or JSON rendering of a table.
     */
    constructor(table: any);
    /**
     * Adds one or more columns to the table
     * @param columns The new columns to add.
     */
    add(...columns: Column[]): void;
    /**
     * Adds a new row of data to the table
     * @param row The row of data to add
     */
    insert(row: Row): void;
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name: string): Column | undefined;
    /**
     * Returns the indexes of all rows in the table.
     */
    indices(): Iterable<number>;
    /**
     * Returns all the columns within the table.
     */
    columns(): Iterable<Column>;
}
