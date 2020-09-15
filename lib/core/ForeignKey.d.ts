import { IColumn } from "./IColumn";
import { Key } from "./Key";
import { Function, Supplier } from "./types";
export declare class ForeignKey implements IColumn {
    readonly name: string;
    readonly key: Key;
    readonly index: Array<number>;
    private convert;
    constructor(name: string, key: Key);
    constructor(name: string, foreignKey: ForeignKey);
    as(name: string): IColumn;
    to<T>(convert: Function<unknown, T>): this;
    insert(value: unknown, indexes: Iterable<number>): void;
    value(index: number): any;
    equals(value: any): Supplier<Function<number, boolean>>;
    in(values: any[]): Supplier<Function<number, boolean>>;
}
