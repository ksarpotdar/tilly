import { IColumn } from "./IColumn";
import { Key } from "./Key";
import { Function, Supplier } from "./types";

export class ForeignKey implements IColumn {
	public readonly name: string;

	public readonly key: Key;

	public readonly index: Array<number>;

	private convert: Function<unknown, any>;

	constructor(name: string, key: Key);

	constructor(name: string, foreignKey: ForeignKey);

	constructor(name: string, p2: Key | ForeignKey) {
		this.name = name;
		this.key = p2 instanceof Key ? p2 : p2.key;
		this.index = p2 instanceof Key ? [] : p2.index;
		this.convert = (value: unknown) => value;
	}

	as(name: string): IColumn {
		return new ForeignKey(name, this);
	}

	to<T>(convert: Function<unknown, T>): this {
		this.convert = convert;

		return this;
	}

	insert(value: unknown, indexes: Iterable<number>): void {
		const position = this.key.values.indexOf(value);

		if(position === -1) {
			throw Error(`Foreign key ${value} does not exist in ${this.key.name} while inserting into ${this.name}`);
		}

		for (const index of indexes) {
			this.index[index] = position;
		}
	}

	value(index: number) {
		return this.convert(this.key.values[this.index[index]]);
	}

	equals(value: any): Supplier<Function<number, boolean>> {
		return () => {
			const position = this.key.values.indexOf(value);

			return (index: number) => {
				return this.index[index] === position;
			}
		}
	}

	in(values: any[]): Supplier<Function<number, boolean>> {
		return () => {
			const indexes: Array<number> = [];

			for (let i = values.length; i--;) {
				const index = this.key.values.indexOf(values[i]);

				if (index !== -1) {
					indexes.push(index);
				}
			}

			return (index: number) => {
				return indexes.indexOf(this.index[index]) !== -1;
			}
		}
	}
}
