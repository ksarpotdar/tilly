/** Represents a column and its data within a table. */
export class Column {
	/** The name of this column */
	public readonly name: string;

	/** The set of distinct, or unique, raw values for this column within the table. */
	private readonly values: Array<unknown>;

	/** The index into the array of distinct values for each row. */
	private readonly index: Array<number>;

	/** A function to convert the returned value to a defined type. */
	private convert: ((raw: unknown) => any);

	/**
	 * Creates a new instance of the Column class.
	 * @param name The name of the column.
	 */
	public constructor(name: string);

	/**
	 * Creates a new instance of the Column class.
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
	 */
	public to<T>(convert: (value: unknown) => T): this {
		this.convert = convert;

		return this;
	}

	/**
	 * Inserts a new row into the column.
	 * @param value The value to add.
	 */
	public insert(value: unknown, start: number, count: number): void {
		let position = this.values.indexOf(value);

		if (position === -1) {
			position = this.values.push(value) - 1;
		}

		for (let i = 0; i < count; ++i) {
			this.index[start + i] = position;
		}
	}

	/**
	 * Returns a value from the column for a specific row index.
	 * @param index The row index to return.
	 */
	public value(index: number): any {
		return this.convert(this.values[this.index[index]]);
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based on equality.
	 * @param value The value to test against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	equals(value: unknown): (index: number) => boolean {
		const position = this.values.indexOf(value);

		return index => this.index[index] === position;
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
	 * @param regex A regular expression that will be tested to select rows.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	like(regex: RegExp): (index: number) => boolean {
		const positions: Array<number> = [];

		// determine the indices of the values that match the regular expression
		for (let i = 0, j = this.values.length; i < j; ++i) {
			if (regex.test(String(this.values[i]))) {
				positions.push(i);
			}
		}

		// Return a function that returns true if the row matches the regex results
		return index => positions.indexOf(this.index[index]) !== -1;
	}

	/**
	 * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
	 * @param values A list of values to test the column against.
	 * @returns Returns the predicate to be used within a query where method.
	 */
	list(...values: unknown[]): (index: number) => boolean {
		const positions: Array<number> = [];

		// determine the indices of the values in the provided list
		for (let i = 0, j = this.values.length; i < j; ++i) {
			if (values.indexOf(this.values[i]) !== -1) {
				positions.push(i);
			}
		}

		return index => positions.indexOf(this.index[index]) !== -1;
	}
}
