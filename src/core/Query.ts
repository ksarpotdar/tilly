import { IColumn } from './IColumn';
import { Table } from './Table';
import { Operator, Row } from './types';

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query {
	/**
	 * The operator that will create the predicate that this query will use to restrict the number of rows from source table.
	 * @private
	 */
	private operator: Operator;

	/**
	 * The columns that will be returned by this query.
	 */
	public columns: Array<IColumn>;

	/**
	 * Created a new instance of the query class.
	 * @param source Another queryable object to use as the source for this query.
	 */
	public constructor(private readonly source: Table | Query) {
		this.operator = () => (index: number) => true;
		this.columns = [];
	}

	/**
	 * Defines the columns that will be returned by this query.
	 * @param columns The set of columns from the underlying soure that will be returned by this query.
	 * @return Fluent API call, so returns this.
	 */
	public select(...columns: Array<IColumn>): this {
		this.columns = columns;

		return this;
	}

	/**
	 * Defines the filter critera that will be applied to rows retrieved from the source.
	 * @param operator The predicate built using the supplied column oriented predicates ([[equals]], [[in]], [[and]], [[or]], etc.).
	 * @return Fluent API call, so returns this.
	 */
	public where(operator: Operator): this {
		this.operator = operator;

		return this;
	}

	/**
	 * Returns the row indexes that this query will return when executed.
	 * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
	 */
	public *indexes(): IterableIterator<number> {
		// generate the predicate that will be used to filter the rows.
		const predicate = this.operator();

		// filter the rows
		for (const index of this.source.indexes()) {
			if (predicate(index) === true) {
				yield index;
			}
		}
	}

	/**
	 * Gets a row for a given index.
	 * @param index The index of the row.
	 * @return Returns the row of data
	 */
	public row(index: number): Row {
		const result: Row = {};

		// create each row in the result
		for (const column of this.columns) {
			result[column.name] = column.value(index);
		}

		return result;
	}

	/**
	 * Checks a query to see if there are any results.
	 * @returns Returns true if a query has results.
	 */
	public exists(): boolean {
		for(const index of this.indexes()) {
			return true;
		}

		return false;
	}

	/**
	 * Makes the query iterable.
	 * @returns Returns an interable iterator to the result rows.
	 */
	public *[Symbol.iterator](): IterableIterator<Row> {
		for (const index of this.indexes()) {
			yield this.row(index);
		}
	}
}
