import { Function, Operator } from "./types";
export declare abstract class ColumnBase {
    readonly name: string;
    readonly values: Array<unknown>;
    /**
     * A function to convert the returned value to a defined type.
     * @protected
     */
    protected convert: Function<unknown, any>;
    /**
     * Creates a new instance of the common parts of the ColumnBase class
     * @param name The name of the column.
     * @param values The set of distinct, raw values within the column.
     */
    constructor(name: string, values: Array<unknown>);
    /**
     * Adds a conversion function used when retreiving data.
     * @param convert A callback to convert each value on retrieval.
     */
    to<T>(convert: Function<unknown, T>): this;
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns The new column alias.
     */
    abstract as(name: string): ColumnBase;
    /**
     * Inserts a new value into the column at a defined set of positions.
     * @param value The value to insert.
     * @param indexes The range of indexes to insert.
     */
    abstract insert(value: unknown, indexes: Iterable<number>): void;
    /**
     * Returns a value from a specific row index.
     * The returned row will have the conversion function applied if specified by the [to] method.
     * @param index
     */
    abstract value(index: number): any;
    /**
     * Creates and operator to test for equality.
     * @param value The value to test equality for.
     */
    abstract equals(value: any): Operator;
    /**
     * Creates and operator to test if a rows value is in a set of values.
     * @param value The value to test equality for.
     */
    abstract in(values: Array<any>): Operator;
}
