import { Operator } from './types';
import { ColumnBase } from './IColumn';
/**
 * A primary key is a type of column where all the values are known to be unique.
 */
export declare class Key extends ColumnBase {
    /** A flag indicating if the key has a unique constraint. */
    readonly unique: boolean;
    /**
     * Creates a new instance of the Column class.
     * @param name The name of the column.
     * @param unique A flag used to determine if the key should be unique
     */
    constructor(name: string, unique: boolean);
    /**
     * Copy constructor; creates a new instance of the PrimaryKey class from another object with the same values.
     * @param name The name of the column.
     * @param column The column to copy.
     */
    constructor(name: string, column: Key);
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name: string): ColumnBase;
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     * @param indexes The set of indexes to insert the value into.
     * @private Package private.
     */
    insert(value: unknown, indexes: Iterable<number>): void;
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     * @private Package private.
     */
    value(index: number): any;
    /**
     * Generates a condition to be used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns an operator to be used within a query where method.
     */
    equals(value: unknown): Operator;
    /**
     * Creates and operator to test if a rows value is in a set of values.
     * @param value The value to test equality for.
     */
    in(values: Array<any>): Operator;
}
