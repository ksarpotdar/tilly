import { Function, Operator } from './types';
import { IColumn } from './IColumn';

/** Represents a column and its data within a table. */
export class Column implements IColumn {
	/** The name of this column */
	public readonly name: string;

	/**
	 * The set of distinct, raw values for this column within the table.
	 */
	public readonly distinct: Array<unknown>;

	/**
	 * The index into the array of distinct values for each row. 
	 * @private
	 */
	private readonly index: Array<number>;

	/**
	 * A function to convert the returned value to a defined type.
	 * @private
	 */
	private convert: Function<unknown, any>;

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
		this.name = name;
		this.distinct = column ? column.distinct : [];
		this.index = column ? column.index : [];
		this.convert = (value: unknown) => value;
	}

	/**
	 * Creates a column alias with a different name.
	 * @param name The alias name for the column.
	 * @returns A virtual column.
	 */
	public as(name: string): Column {
		return new Column(name, this);
	}

	/**
	 * Allows the column to be converted to a specific type.
	 * @param convert A function used to convert to the defined type.
	 * @return Fluent API call, so returns this.
	 */
	public to<T>(convert: Function<unknown, T>): this {
		this.convert = convert;

		return this;
	}

	/**
	 * Inserts a new row into the column.
	 * @param value The value to add.
	 * @param indexes The set of indexes to insert the value into.
	 * @private Package private.
	 */
	insert(value: unknown, indexes: Iterable<number>): void {
		let position = this.distinct.indexOf(value);

		if (position === -1) {
			this.distinct[position = this.distinct.length] = value;
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
		return this.convert(this.distinct[this.index[index]]);
	}

	/**
	 * Generates an operator to be used in Query.where to filter a column by a list of values.
	 * @param values The list of values to filter the column by.
	 */
	public in(values: Array<any>): Operator {
		return () => {
			const indexes: Array<number> = [];

			for (let i = values.length; i--;) {
				const index = this.distinct.indexOf(values[i]);

				if (index !== -1) {
					indexes.push(index);
				}
			}

			return (index: number) => {
				return indexes.indexOf(this.index[index]) !== -1;
			}
		}
	}

	/**
	 * Generates an operator to be used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public equals(value: unknown): Operator {
		return () => {
			const position = this.distinct.indexOf(value);

			return (index: number) => {
				return this.index[index] === position;
			}
		}
	}
}
