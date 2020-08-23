import { IQueryable } from './IQueryable';
import { Column } from './Column';
import { Predicate, Row } from './types';

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query implements IQueryable {
	/**
	 * The predicate that this query will use to restrict the number of rows from source table.
	 * @private
	 */
	private predicate: Predicate<number>;

	/**
	 * The columns that will be returned by this query.
	 * @private
	 */
	private allColumns: Iterable<Column>;

	/**
	 * Created a new instance of the query class.
	 * @param queryable Another queryable object to use as the source for this query.
	 */
	public constructor(private readonly source: IQueryable) {
		this.predicate = (index: number) => true;
		this.allColumns = source.columns();
	}

	/**
	 * Defines the columns that will be returned by this query.
	 * @param columns The set of columns from the underlying soure that will be returned by this query.
	 * @return Fluent API call, so returns this.
	 */
	public select(...columns: Column[]): this {
		this.allColumns = columns;

		return this;
	}

	/**
	 * Defines the filter critera that will be applied to rows retrieved from the source.
	 * @param predicate A boolean predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
	 * @return Fluent API call, so returns this.
	 */
	public where(predicate: Predicate<number>): this {
		this.predicate = predicate;

		return this;
	}

	/**
	 * Returns the set of columns that this query will return when executed.
	 * @returns Returns an iterator for all the columns specified in the select method.
	 */
	public columns(): Iterable<Column> {
		return this.allColumns;
	}

	/**
	 * Returns the row indices that this query will return when executed.
	 * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
	 */
	public *indices(): Iterable<number> {
		for (const index of this.source.indices()) {
			if (this.predicate(index)) {
				yield index;
			}
		}
	}

	/**
	 * Makes the queryable object itself iterable.
	 * @returns Returns an interable iterator to the result rows.
	 */
	*[Symbol.iterator](): IterableIterator<Row> {
		for (const index of this.indices()) {
			const row: Row = {};

			// create each row in the result
			for (const column of this.columns()) {
				row[column.name] = column.value(index);
			}

			yield row;
		}
	}
}
