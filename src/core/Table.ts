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
	private readonly allColumns: Array<Column> = [];

	/**
	 * Creates a new instance of the Table class.
	 * @param name The name of the table.
	 */
	public constructor(name: string);

	/**
	 * Creates a new instance of the Table class.
	 * @param column Another table to copy as a baseline.
	 */
	public constructor(column: any);

	public constructor(param: any) {
		super();

		if (typeof param === "string") {
			this.name = param;
			this.rowCount = 0;
		} else {
			this.name = param.name;
			this.rowCount = param.rowCount;

			for (const column of param.allColumns) {
				this.allColumns.push(new Column(column));
			}
		}
	}

	/**
	 * Adds a new column to the table
	 * @param column The new column to add.
	 */
	public add(column: Column): Column {
		this.allColumns.push(column);

		column.offset = this.rowCount;

		return column;
	}

	/**
	 * Adds a new row of data to the table
	 * @param row The row of data to add
	 */
	public insert(row: Row): void {
//		const keys = Object.keys(row);

		for (const column of this.allColumns) {
			column.insert(row[column.name], this.rowCount);
//			const value = row[column.name];

//			column.insert(keys.indexOf(column.name) === -1 ? column.defaultValue : value, this.rowCount);
		}

		this.rowCount++;
	}

	/**
	 * Returns the table coumn of the given name.
	 * @param name The name of the column to find.
	 */
	public column(name: string): Column {
		return this.allColumns.filter(column => column.name === name)[0];
	}

	/**
	 * Returns the indexes of all rows in the table.
	 * @private
	 */
	*indices(): Iterable<number> {
		for (let index = 0, length = this.rowCount; index < length; ++index) {
			yield index;
		}
	}

	/**
	 * Returns all the columns within the table.
	 * @private
	 */
	columns(): Iterable<Column> {
		return this.allColumns;
	}
}
