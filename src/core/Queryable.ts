import { Operator, Row } from './types';
import { IColumn } from './IColumn';
import { Column } from './Column';
import { Key } from './Key';
import { and } from './operators'

/**
 * Internal base class for tables and queries.
 * @private
 */
abstract class Queryable {
	abstract indexes(operator: Operator | undefined): Iterable<number>;

	public where(operator: Operator): Query {
		return new Query(this, operator);
	}

	public row(index: number, ...columns: Array<IColumn>): Row {
		const result: Row = {};

		for (const column of columns) {
			result[column.name] = column.value(index);
		}

		return result;
	}

	public * select(...columns: Array<IColumn>): Iterable<Row> {
		for (const index of this.indexes(undefined)) {
			yield this.row(index, ...columns);
		}
	}
}

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
				column.insert(null, this.indexes(undefined));
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

	/**
	 * Returns the indexes of all rows in the table with an optional filter criteria.
	 * @private
	 */
	* indexes(operator: Operator | undefined): Iterable<number> {
		const predicate = operator ? operator() : () => true;

		for (let i = 0; i < this.rows; ++i) {
			if (predicate(i)) {
				yield i;
			}
		}
	}
}

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query extends Queryable {
	/**
	 * Created a new instance of the query class.
	 * @param source Another queryable object to use as the source for this query.
	 * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
	 */
	public constructor(private readonly source: Queryable, private readonly operator: Operator) {
		super();
	}

	/**
	 * Returns the indexes of all rows in the query with an optional filter criteria.
	 * @private
	 */
	indexes(operator: Operator | undefined): Iterable<number> {
		return this.source.indexes(operator ? and(operator,this.operator) : this.operator);
	}
}
