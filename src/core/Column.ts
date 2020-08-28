import { Supplier, Function, Predicate } from './types';

/** Represents a column and its data within a table. */
export class Column {
	/** The name of this column */
	public readonly name: string;

	/**
	 * The set of distinct, or unique, raw values for this column within the table.
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
	 * @param column Another column to copy as a baseline.
	 * @param alias An alternative name for the new column.
	 */
	public constructor(column: Column, alias?: string);

	public constructor(p1: string | Column, p2?: string) {
		if (typeof p1 === "string") {
			this.name = p1;
			this.distinct = [];
			this.index = [];
		} else {
			this.name = p2 || p1.name;
			this.distinct = p1.distinct;
			this.index = p1.index;
		}

		this.convert = (value: unknown) => value;
	}

	/**
	 * Creates a column alias with a different name.
	 * @param name The alias name for the column.
	 * @returns A virtual column.
	 */
	public as(name: string): Column {
		return new Column(this, name);
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
	 * @param from The first row to insert the value into.
	 * @param to The first row not to insert the value into. Start and end provide a range from the start and up to, but not including the end.
	 * @private Package private.
	 */
	insert(value: unknown, from: number, to: number): void { // TODO: remove from/to with an iterator providing indices
		if (from < to) {
			let position = this.distinct.indexOf(value);

			if (position === -1) {
				this.distinct[position = this.distinct.length] = value;
			}

			while (from < to) {
				this.index[from++] = position;
			}
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
	 * Generates a condition based on a callback to be used within a where clause
	 * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
	 */
	public evaluate(predicate: Predicate<any>): Supplier<Predicate<number>> {
		return () => {
			return (index: number) => {
				return predicate(this.value(index));
			}
		}
	}

	/**
	 * Generates a condition to be used in Query.where to filter a column by a list of values.
	 * @param values The list of values to filter the column by.
	 */
	public in(values: Array<any>): Supplier<Predicate<number>> {
		return () => {
			const indices: Array<number> = [];

			for (let i = values.length; i--;) {
				const index = this.distinct.indexOf(values[i]);

				if (index !== -1) {
					indices.push(index);
				}
			}

			return (index: number) => {
				return indices.indexOf(this.index[index]) !== -1;
			}
		}
	}

	/**
	 * Generates a condition to be used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public equals(value: unknown): Supplier<Predicate<number>> {
		return () => {
			let position = this.distinct.indexOf(value);

			return (index: number) => {
				return this.index[index] === position;
			}
		}
	}
}
