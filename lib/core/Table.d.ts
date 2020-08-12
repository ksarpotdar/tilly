import { Queryable } from './Queryable';
import { Column } from './Column';
import { Row } from './Row';
/**
 * Represents a table of data, comprising a number of columns.
 */
export declare class Table extends Queryable {
    /** The name of this table */
    readonly name: string;
    /** The number of rows inserted into the table. */
    private rowCount;
    /** All the columns within the table. */
    private readonly allColumns;
    /**
     * Creates a new instance of the Table class.
     * @param name The name of the table.
     */
    constructor(name: string);
    /**
     * Creates a new instance of the Table class.
     * @param column Another table to copy as a baseline.
     */
    constructor(column: any);
    /**
     * Adds a new column to the table
     * @param column The new column to add.
     */
    add(column: Column): Column;
    /**
     * Adds a new row of data to the table
     * @param row The row of data to add
     */
    insert(row: Row): void;
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name: string): Column;
    /**
     * Returns the indexes of all rows in the table.
     */
    indices(): Iterable<number>;
    /**
     * Returns all the columns within the table.
     */
    columns(): Iterable<Column>;
}
