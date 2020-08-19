import { Function, Predicate } from './types';
/** Represents a column and its data within a table. */
export declare class Column {
    /** The name of this column */
    readonly name: string;
    /**
     * The set of distinct, or unique, raw values for this column within the table.
     */
    private readonly distinct;
    /**
     * The index into the array of distinct values for each row.
     * @private
     */
    private readonly index;
    /**
     * A function to convert the returned value to a defined type.
     * @private
     */
    private convert;
    /**
     * Creates a new instance of the Column class.
     * @param name The name of the column.
     */
    constructor(name: string);
    /**
     * Copy constructor; creates a new instance of the Column class from another object with the same values.
     * @param column Another column to copy as a baseline.
     * @param name An alternative name for the new column.
     */
    constructor(column: any, name?: string);
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name: string): Column;
    /**
     * Allows the column to be converted to a specific type.
     * @param convert A function used to convert to the defined type.
     * @return Fluent API call, so returns this.
     */
    to<T>(convert: Function<unknown, T>): this;
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     * @param start The first row to insert the value into.
     * @param end The first row not to insert the value into. Start and end provide a range from the start and up to, but not including the end.
     * @private Package private.
     */
    insert(value: unknown, start: number, end: number): void;
    /**
     * Returns the distinct set of values that could be returned by a call to the value method.
     */
    values(): Array<any>;
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     * @private Package private.
     */
    value(index: number): any;
    /**
     * Enables a user-defined predicate to be used within a where clause
     * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
     * @returns Returns the predicate to be used within a query where method.
     */
    evaluate(predicate: Predicate<any>): Predicate<number>;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value: unknown): Predicate<number>;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table less than a specified value.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    lessThan<T>(value: T): Predicate<number>;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table greater than a specified value.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    greaterThan<T>(value: T): Predicate<number>;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
     * @param regex A regular expression that will be tested to select rows.
     * @returns Returns the predicate to be used within a query where method.
     */
    like(regex: RegExp): Predicate<number>;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
     * @param values A list of values to test the column against.
     * @returns Returns the predicate to be used within a query where method.
     */
    in(...values: unknown[]): Predicate<number>;
}
