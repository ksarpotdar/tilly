import { Function, Operator } from './types';
import { IColumn } from './IColumn';

/**
 * A primary key is a type of column where all the values are known to be unique.
 */
export class Key implements IColumn {
	/** The name of this column */
	public readonly name: string;

	/**
	 * The set of distinct, raw values for this column within the table.
	 */
	public readonly values: Array<unknown>;

	/**
	 * Creates a new instance of the Column class.
	 * @param name The name of the column.
	 */
	public constructor(name: string);

	/**
	 * Copy constructor; creates a new instance of the PrimaryKey class from another object with the same values.
	 * @param column Another column to copy as a baseline.
	 * @param alias An alternative name for the new column.
	 */
	public constructor(column: Key, alias?: string);

	public constructor(p1: string | Key, p2?: string) {
		if (typeof p1 === "string") {
			this.name = p1;
			this.values = [];
		} else {
			this.name = p2 || p1.name;
			this.values = p1.values;
		}
	}

	/**
	 * Creates a column alias with a different name.
	 * @param name The alias name for the column.
	 * @returns A virtual column.
	 */
	public as(name: string): Key {
		return new Key(this, name);
	}

	/**
	 * Allows the column to be converted to a specific type.
	 * @param convert A function used to convert to the defined type.
	 * @return Fluent API call, so returns this.
	 */
	public to<T>(convert: Function<unknown, T>): this {
		return this;
	}

	/**
	 * Inserts a new row into the column.
	 * @param value The value to add.
	 * @param indexes The set of indexes to insert the value into.
	 * @private Package private.
	 */
	insert(value: unknown, indexes: Iterable<number>): void {
		for (const index of indexes) {
			this.values[index] = value;
		}
	}

	/**
	 * Returns a value from the column for a specific row index.
	 * @param index The row index to return.
	 * @private Package private.
	 */
	value(index: number): any {
		return this.values[index];
	}

	/**
	 * Generates a condition to be used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns an operator to be used within a query where method.
	 */
	public equals(value: unknown): Operator {
		return () => {
			return (index: number) => {
				return this.values[index] === value;
			}
		}
	}

	public in(values: Array<any>): Operator {
		return () => {
			return (index: number) => {
				return values.indexOf(this.values[index]) !== -1;
			}
		}
	}
}
