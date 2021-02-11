import { Operator } from './types';
import { ColumnBase } from './IColumn';

/** Represents a column and its data within a table. */
export class Column extends ColumnBase {
	/**
	 * The index into the array of distinct values for each row. 
	 * @private
	 */
	private readonly index: Array<number>;

	/**
	 * Creates a new instance of the Column class.
	 * @param name The name of the column.
	 */
	public constructor(name: string);

	/**
	 * Copy constructor; creates a new instance of the Column class from another object with the same values.
	 * @param name The name of the column.
	 * @param column Another column to copy as a baseline.
	 */
	public constructor(name: string, column: Column);

	public constructor(name: string, column?: Column) {
		super(name, column ? column.values : []);
		this.index = column ? column.index : [];
	}

	/**
	 * Creates a column alias with a different name.
	 * @param name The alias name for the column.
	 * @returns A virtual column.
	 */
	public as(name: string): ColumnBase {
		return new Column(name, this);
	}

	/**
	 * Inserts a new row into the column.
	 * @param value The value to add.
	 * @param indexes The set of indexes to insert the value into.
	 * @private Package private.
	 */
	insert(value: unknown, indexes: Iterable<number>): void {
		let position = this.values.indexOf(value);

		if (position === -1) {
			this.values[position = this.values.length] = value;
		}

		for (const index of indexes) {
			this.index[index] = position;
		}
	}

	/**
	 * Returns a value from the column for a specific row index.
	 * @param index The row index to return.
	 * @private Package private.
	 */
	value(index: number): any {
		return this.convert(this.values[this.index[index]]);
	}

	/**
	 * Generates an operator to be used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public equals(value: unknown): Operator {
		return () => {
			const position = this.values.indexOf(value);

			return (index: number) => {
				return this.index[index] === position;
			}
		}
	}

	/**
	 * Generates an operator to be used in Query.where to filter a column by a list of values.
	 * @param values The list of values to filter the column by.
	 */
	public in(values: Array<any>): Operator {
		return () => {
			const indexes: Array<number> = [];

			for (let i = values.length; i--;) {
				const index = this.values.indexOf(values[i]);

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
