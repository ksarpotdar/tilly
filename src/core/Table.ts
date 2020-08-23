import { IQueryable } from './IQueryable';
import { Column } from './Column';
import { Row } from './types';

/**
 * Represents a table of data, comprising a number of columns.
 */
export class Table implements IQueryable {
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
	private readonly allColumns: Array<Column>;

	/**
	 * Creates a new instance of the Table class.
	 * @param name The name of the table.
	 */
	public constructor(name: string);

	/**
	 * Creates a new instance of the Table class.
	 * @param table Another table to copy as a baseline or JSON rendering of a table.
	 */
	public constructor(table: any);

	public constructor(p1: any) {
		if (typeof p1 === "string") {
			this.name = p1;
			this.allColumns = [];
			this.rowCount = 0;
		} else {
			this.name = p1.name;
			this.allColumns = p1.allColumns.map((column: any) => new Column(column));
			this.rowCount = p1.rowCount;
		}
	}

	/**
	 * Adds one or more columns to the table
	 * @param columns The new columns to add.
	 */
	public add(...columns: Column[]): void {
		for (const column of columns) {
			// add the column to the table
			this.allColumns.push(column);

			// add empty entries for existing rows
			column.insert(null, 0, this.rowCount);
		}
	}

	/**
	 * Adds a new row of data to the table
	 * @param row The row of data to add
	 */
	public insert(row: Row): void {
		const start = this.rowCount++;

		for (const column of this.allColumns) {
			column.insert(row[column.name], start, this.rowCount);
		}
	}

	/**
	 * Returns the table coumn of the given name.
	 * @param name The name of the column to find.
	 */
	public column(name: string): Column | undefined {
		return this.allColumns.find(col => col.name === name);
	}

	/**
	 * Returns the indexes of all rows in the table.
	 */
	public *indices(): Iterable<number> {
		let index = 0;

		while (index < this.rowCount) {
			yield index++;
		}
	}

	/**
	 * Returns all the columns within the table.
	 */
	public columns(): Iterable<Column> {
		return this.allColumns;
	}

	private *run(): IterableIterator<Row> {
		for (const index of this.indices()) {
			const row: Row = {};

			// create each row in the result
			for (const column of this.columns()) {
				row[column.name] = column.value(index);
			}

			yield row;
		}
	}

	/**
	 * Makes the queryable object itself iterable.
	 * @returns Returns an interable iterator to the result rows.
	 */
	public [Symbol.iterator](): IterableIterator<Row> {
		return this.run();
	}
}
