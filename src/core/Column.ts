import { Function, Predicate } from './types';

/** Represents a column and its data within a table. */
export class Column {
	/** The name of this column */
	public readonly name: string;

	/**
	 * The set of distinct, or unique, raw values for this column within the table.
	 */
	private readonly values: Array<unknown>;

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
	 * @param name An alternative name for the new column.
	 */
	public constructor(column: any, name?: string);
	public constructor(p1: any, p2?: string) {
		if (typeof p1 === "string") {
			this.name = p1;
			this.values = [];
			this.index = [];
		} else {
			this.name = p2 || p1.name;
			this.values = p1.values;
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
	 * @param start The first row to insert the value into.
	 * @param end The first row not to insert the value into. Start and end provide a range from the start and up to, but not including the end.
	 * @private Package private.
	 */
	insert(value: unknown, start: number, end: number): void {
		if (start < end) {
			let position = this.values.indexOf(value);

			if (position === -1) {
				this.values[position = this.values.length] = value;
			}

			while (start < end) {
				this.index[start++] = position;
			}
		}
	}

	/**
	 * Returns the distinct set of values that could be returned by a call to the value method.
	 */
	distinct(): Array<any> {
		return this.values.map(this.convert);
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
	 * Enables a user-defined predicate to be used within a where clause
	 * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public evaluate(predicate: Predicate<any>): Predicate<number> {
		return index => predicate(this.value(index));
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public equals(value: unknown): Predicate<number> {
		const position = this.values.indexOf(value);

		return index => this.index[index] === position;
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
	 * @param regex A regular expression that will be tested to select rows.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public like(regex: RegExp): Predicate<number> {
		const indices: Array<number> = [];

		for (let i = this.values.length; i--;) {
			if (regex.test(String(this.values[i]))) {
				indices.push(i);
			}
		}

		// Return a function that returns true if the row matches the regex results
		return index => indices.indexOf(this.index[index]) !== -1;
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
	 * @param values A list of values to test the column against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	public in(...values: unknown[]): Predicate<number> {
		const indices: Array<number> = [];

		for (let i = this.values.length; i--;) {
			if (values.indexOf(this.values[i]) !== -1) {
				indices.push(i);
			}
		}

		// Return a function that returns true if the row matches the regex results
		return index => indices.indexOf(this.index[index]) !== -1;
	}
}
