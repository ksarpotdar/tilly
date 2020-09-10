import { Function, Operator } from './types';
import { IColumn } from './IColumn';
/**
 * A primary key is a type of column where all the values are known to be unique.
 */
export declare class PrimaryKey implements IColumn {
    /** The name of this column */
    readonly name: string;
    /**
     * The set of distinct, raw values for this column within the table.
     */
    readonly values: Array<unknown>;
    /**
     * Creates a new instance of the Column class.
     * @param name The name of the column.
     */
    constructor(name: string);
    /**
     * Copy constructor; creates a new instance of the PrimaryKey class from another object with the same values.
     * @param column Another column to copy as a baseline.
     * @param alias An alternative name for the new column.
     */
    constructor(column: PrimaryKey, alias?: string);
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name: string): PrimaryKey;
    /**
     * Allows the column to be converted to a specific type.
     * @param convert A function used to convert to the defined type.
     * @return Fluent API call, so returns this.
     */
    to<T>(convert: Function<unknown, T>): this;
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
    in(values: Array<any>): Operator;
}
