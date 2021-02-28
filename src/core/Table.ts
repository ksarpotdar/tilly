import { Column } from './Column';
import { Query } from './Query';
import { Operator, Row } from './types';

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
	public readonly columns: Array<Column>;

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
		this.name = typeof p1 === "string" ? p1 : p1.name;
		this.columns = typeof p1 === "string" ? [] : p1.columns.map(col => new Column(col.name, col));
		this.rows = typeof p1 === "string" ? 0 : p1.rows;
	}

	/**
	 * Adds one or more columns to the table
	 * @param columns The new columns to add.
	 */
	public add(...columns: Array<Column>): void {
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
	public row(index: number, ...columns: Array<Column>): Row {
		return Object.fromEntries((columns.length ? columns : this.columns).map(column => [column.name, column.value(index)]));
	}

	/**
	 * Returns the number of rows within the column.
	 */
	public count(): number {
		return this.rows;
	}


	/**
	 * Returns all the row within the table; a row being the columns specified, or if not specified, all colunms.
	 * @param columns The columns to return in each row; if not provided, all columns will be returned.
	 */
	public * select(...columns: Array<Column>): Iterable<Row> {
		for (const index of this.indexes()) {
			yield this.row(index, ...columns.length ? columns : this.columns);
		}
	}

	/**
	 * Creates a query to filter the contents of a table based on a predicate.
	 * @param operator An Operator object that creates the filter predicate at query execution time.
	 */
	public where(operator: Operator): Query {
		return new Query(this, operator);
	}

	/**
	 * Returns the indexes of all rows in the table with an optional filter criteria.
	 * @private
	 */
	* indexes(operator?: Operator): Iterable<number> {
		const predicate = operator ? operator() : () => true;

		for (let i = 0, l = this.rows; i < l; ++i) {
			if (predicate(i)) {
				yield i;
			}
		}
	}
}
