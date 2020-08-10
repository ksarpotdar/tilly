/** Represents a column and its data within a table. */
export declare class Column {
    /** The name of this column */
    readonly name: string;
    /** The default value to use if the row being inserted has no value for this column */
    private defaultValue;
    /** The set of distinct, or unique, raw values for this column within the table. */
    private readonly values;
    /** The index into the array of distinct values for each row. */
    private readonly index;
    /**
     * A row offset for columns that were added after rows had been added to other columns.
     * @private Package private as we need update this on the addition to a table.
     */
    offset: number;
    /** A function to convert the returned value to a defined type. */
    private convert?;
    /**
     * Creates a new instance of the Column class.
     * @param name The name of the column.
     */
    constructor(name: string);
    /**
     * Creates a new instance of the Column class.
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
     */
    to<T>(convert?: (value: unknown) => T): this;
    /**
     * Sets the default value of the column if no value is specified when inserting.
     * @note By not specified, we mean that the row that was inserted into the table had no property matching the column name. If there is a property, but with an undefined or null value, the undefined or null value will be stored. If you wish to return default values were undefined or null values are stored, use a convertor specified using the [[as]] method.
     * @param The default value to use.
     */
    default<T>(defaultValue: T): this;
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     */
    insert(value: unknown, start: number): void;
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     */
    value(index: number): any;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value: unknown): (index: number) => boolean;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
     * @param regex A regular expression that will be tested to select rows.
     * @returns Returns the predicate to be used within a query where method.
     */
    like(regex: RegExp): (index: number) => boolean;
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
     * @param values A list of values to test the column against.
     * @returns Returns the predicate to be used within a query where method.
     */
    list(...values: unknown[]): (index: number) => boolean;
}
