import { Function, Operator } from "./types";
/**
 * Abstraction of any of the column types.
 * We offer differnt column types as the strategy for efficent data management varies depending on the nature of the data.
 */
export interface IColumn {
    /**
     * The name of the column
     */
    readonly name: string;
    /**
     * Creates an alias of the same type for the column.
     */
    as(name: string): IColumn;
    /**
     * Adds a conversion function used when retreiving data.
     * @param convert A callback to convert each value on retrieval.
     */
    to<T>(convert: Function<unknown, T>): this;
    /**
     * Inserts a new value into the column at a defined set of positions.
     * @param value The value to insert.
     * @param indexes The range of indexes to insert.
     */
    insert(value: unknown, indexes: Iterable<number>): void;
    /**
     * Returns a value from a specific row index.
     * The returned row will have the conversion function applied if specified by the [to] method.
     * @param index
     */
    value(index: number): any;
    /**
     * Creates and operator to test for equality.
     * @param value The value to test equality for.
     */
    equals(value: any): Operator;
    /**
     * Creates and operator to test if a rows value is in a set of values.
     * @param value The value to test equality for.
     */
    in(values: Array<any>): Operator;
}
