import { Column } from './Column';
import { Row } from './types';

/**
 * Represents a table of data, comprising a number of columns.
 */
export class Table {
	/**
	 * The name of this table
	 */
	public readonly name: string;

	/**
	 * The number of rows inserted into the table.
	 * @private
	 */
	private rowCount: number;

	/**
	 * All the columns within the table.
	 * @private
	 */
	private readonly columns: Array<Column>;

	/**
	 * Creates a new instance of the Table class.
	 * @param name The name of the table.
	 */
	public constructor(name: string);

	/**
	 * Creates a new instance of the Table class.
	 * @param table Another table to copy as a baseline or JSON rendering of a table.
	 */
	public constructor(table: Table);

	public constructor(p1: string | Table) {
		if (typeof p1 === "string") {
			this.name = p1;
			this.columns = [];
			this.rowCount = 0;
		} else {
			this.name = p1.name;
			this.columns = p1.columns.map((column: any) => new Column(column));
			this.rowCount = p1.rowCount;
		}
	}

	/**
	 * Adds one or more columns to the table
	 * @param columns The new columns to add.
	 */
	public add(...columns: Column[]): void {
		// add the columns to the table
		this.columns.push(...columns);

		// if the table already has rows, add null rows to the newly added columns
		if (this.rowCount) {
			for (const column of columns) {
				column.insert(null, this.indices());
			}
		}
	}

	/**
	 * Adds a new row of data to the table
	 * @param row The row of data to add
	 */
	public insert(row: Row): void {
		// add a new row with appropriate value, or null if not found, to each column
		for (const column of this.columns) {
			column.insert(row[column.name] || null, [this.rowCount]);
		}

		this.rowCount++;
	}

	/**
	 * Returns the table coumn of the given name.
	 * @param name The name of the column to find.
	 */
	public column(name: string): Column | undefined {
		return this.columns.find(col => col.name === name);
	}

	/**
	 * Returns the indexes of all rows in the table.
	 */
	public * indices(): IterableIterator<number> {
		for (let i = 0; i < this.rowCount; i++) {
			yield i;
		}
	}
}
