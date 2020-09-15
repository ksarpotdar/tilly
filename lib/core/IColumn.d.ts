import { Function, Operator } from "./types";
export interface IColumn {
    readonly name: string;
    as(name: string): IColumn;
    to<T>(convert: Function<unknown, T>): this;
    insert(value: unknown, indexes: Iterable<number>): void;
    value(index: number): any;
    equals(value: any): Operator;
    in(values: Array<any>): Operator;
}
