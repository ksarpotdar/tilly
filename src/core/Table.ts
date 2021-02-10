import { IColumn } from './IColumn';
import { Column } from './Column';
import { Key } from './Key';
import { Queryable } from './Queryable';
import { Query } from './Query';
import { Operator, Row } from './types';

/**
 * Represents a table of data, comprising a number of columns.
 */
export class Table extends Queryable {
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
		super();

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
	 * @param data The row of data to add
	 * @returns Returns the row index within the table
	 */
	public insert(row: Row): number {
		// add a new row with appropriate value, or null if not found, to each column
		for (const column of this.columns) {
			column.insert(column.name in row ? row[column.name] : null, [this.rows]);
		}

		return this.rows++;
	}

	/**
	 * Gets a row for a given index.
	 * @param index The index of the row.
	 * @return Returns the row of data
	 */
	public row(index: number, ...columns: Array<IColumn>): Row {
		return super.row(index, ...(columns.length === 0 ? this.columns : columns));
	}

	/**
	 * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
	 * @param columns The columns to return in each row; if not provided, all columns will be returned.
	 */
	public select(...columns: Array<IColumn>): Iterable<Row> {
		return super.select(...(columns.length === 0 ? this.columns : columns));
	}

	public where(operator: Operator): Query {
		return new Query(this, operator);
	}

	/**
	 * Returns the indexes of all rows in the table with an optional filter criteria.
	 * @private
	 */
	* indexes(operator?: Operator): Iterable<number> {
		const predicate = operator ? operator() : () => true;

		for (let i = 0; i < this.rows; ++i) {
			if (predicate(i)) {
				yield i;
			}
		}
	}
}
