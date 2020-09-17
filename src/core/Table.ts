import { IColumn } from './IColumn';
import { Column } from './Column';
import { Key } from './Key';
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
	private rows: number;

	/**
	 * All the columns within the table.
	 */
	public readonly columns: Array<IColumn>;

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
			this.rows = 0;
		} else {
			this.name = p1.name;
			this.columns = p1.columns.map((json: any) => 'distinct' in json ? new Column(json.name, json) : new Key(json.name, json));
			this.rows = p1.rows;
		}
	}

	/**
	 * Adds one or more columns to the table
	 * @param columns The new columns to add.
	 */
	public add(...columns: Array<IColumn>): void {
		for (const column of columns) {
			// if the table already has rows, add null rows to the newly added columns
			if (this.rows !== 0) {
				column.insert(null, this.indexes());
			}

			// add the columns to the table
			this.columns.push(column);
		}
	}

	/**
	 * Adds a new row of data to the table
	 * @param rows One or more rows of data to add
	 */
	public insert(...rows: Array<Row>): void {
		for (const row of rows) {
			// add a new row with appropriate value, or null if not found, to each column
			for (const column of this.columns) {
				column.insert(column.name in row ? row[column.name] : null, [this.rows]);
			}

			this.rows++;
		}
	}

	/**
	 * Returns the table coumn of the given name.
	 * @param name The name of the column to find.
	 */
	public column(name: string): IColumn | undefined {
		return this.columns.find(col => col.name === name);
	}

	/**
	 * Returns the indexes of all rows in the table.
	 */
	public * indexes(): IterableIterator<number> {
		for (let i = 0; i < this.rows; i++) {
			yield i;
		}
	}
}
