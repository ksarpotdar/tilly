import { Function, Operator, Predicate } from './types';

/** Represents a column and its data within a table. */
export class Column {
	/**
	 * The set of distinct values seen within the column.
	 * @private
	 */
	private readonly values: Array<unknown>;

	/**
	 * The index into the array of distinct values for each row. 
	 * @private
	 */
	readonly index: Array<number>;

	/**
	 * An optional function to convert the value from one type to another.
	 * @private
	 */
	private convert?: Function<unknown, any>;

	/**
	 * Copy constructor; creates a new instance of the Column class from another object with the same values.
	 * @param name The name of the column.
	 * @param column Another column to copy as a baseline.
	 */
	public constructor(public readonly name: string, column?: Column) {
		this.values = column ? column.values : [];
		this.index = column ? column.index : [];
	}

	/**
	 * Creates a column alias with a different name.
	 * The underlying column data are shared between the origional column and the alias.
	 * @param name The alias name for the column.
	 * @returns A virtual column.
	 */
	public as(name: string): Column {
		return new Column(name, this);
	}

	/**
	 * Adds a conversion function used when retreiving data.
	 * @param convert A callback to convert each value on retrieval.
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
		let position = this.values.indexOf(value);

		if (position === -1) {
			position = this.values.push(value) - 1;
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
		const raw = this.values[this.index[index]];

		return this.convert ? this.convert(raw) : raw;
	}

	/**
	 * Generates an operator to be used in a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public equals(value: unknown): Operator {
		return () => {
			const position = this.values.indexOf(value);

			return index => this.index[index] === position;
		}
	}

	/**
	 * Generates an operator to be used in Query.where to filter a column by a list of values.
	 * @param values The list of values to filter the column by.
	 */
	public in(values: Array<any>): Operator {
		return () => {
			const indexes = values.map(value => this.values.indexOf(value));

			return index => indexes.includes(this.index[index]);
		}
	}

	/**
	 * Generates and operator to e used in a query; performs an arbitary comparison operation based on a user-supplied callback.
	 * @param predicate The test condition.
	 * @returns Returns the predicate to be used within a query method.
	 */
	public evaluate(predicate: Predicate<any>): Operator {
		return () => index => predicate(this.values[this.index[index]]);
	}
}
