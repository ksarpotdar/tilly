import { IColumn } from './IColumn';
import { Row } from './types';
/**
 * Represents a table of data, comprising a number of columns.
 */
export declare class Table {
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
    row(index: number): Row;
    /**
     * Returns the indexes of all rows in the table.
     */
    indexes(): IterableIterator<number>;
}
