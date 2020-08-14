import { Queryable } from './Queryable';
import { Column } from './Column';
import { Row } from './Row';

/**
 * Represents a table of data, comprising a number of columns.
 */
export class Table extends Queryable {
	/** The name of this table */
	public readonly name: string;

	/** The number of rows inserted into the table. */
	private rowCount: number;

	/** All the columns within the table. */
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

	public constructor(param: any) {
		super();
		
		if (typeof param === "string") {
			this.name = param;
			this.allColumns = [];
			this.rowCount = 0;
		} else {
			this.name = param.name;
			this.allColumns = param.allColumns.map((column: any) => new Column(column));
			this.rowCount = param.rowCount;
		}
	}

	/**
	 * Adds a new column to the table
	 * @param column The new column to add.
	 */
	public add(column: Column): Column {
		// add the column to the table
		this.allColumns.push(column);

		// add empty entries for existing rows
		column.insert(undefined, 0, this.rowCount);

		return column;
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
}
