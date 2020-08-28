import { Column } from './Column';
import { Table } from './Table';
import { Supplier, Predicate, Row } from './types';

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query {
	/**
	 * The supplier that will create the predicate that this query will use to restrict the number of rows from source table.
	 * @private
	 */
	private condition: Supplier<Predicate<number>>;

	/**
	 * The columns that will be returned by this query.
	 * @private
	 */
	private columns: Iterable<Column>;

	/**
	 * Created a new instance of the query class.
	 * @param source Another queryable object to use as the source for this query.
	 */
	public constructor(private readonly source: Table | Query) {
		this.condition = () => (index: number) => true;
		this.columns = [];
	}

	/**
	 * Defines the columns that will be returned by this query.
	 * @param columns The set of columns from the underlying soure that will be returned by this query.
	 * @return Fluent API call, so returns this.
	 */
	public select(...columns: Column[]): this {
		this.columns = columns;

		return this;
	}

	/**
	 * Defines the filter critera that will be applied to rows retrieved from the source.
	 * @param condition The predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
	 * @return Fluent API call, so returns this.
	 */
	public where(condition: Supplier<Predicate<number>>): this {
		this.condition = condition;

		return this;
	}

	/**
	 * Returns the row indices that this query will return when executed.
	 * @returns Returns an iterator for all the rows that meet the criteria specified in the where method.
	 */
	public *indices(): IterableIterator<number> {
		// generate the predicate that will be used to filter the rows.
		const predicate = this.condition();

		// filter the rows
		for (const index of this.source.indices()) {
			if (predicate(index)) {
				yield index;
			}
		}
	}

	/**
	 * Makes the query iterable.
	 * @returns Returns an interable iterator to the result rows.
	 */
	public *[Symbol.iterator](): IterableIterator<Row> {
		for (const index of this.indices()) {
			const row: Row = {};

			// create each row in the result
			for (const column of this.columns) {
				row[column.name] = column.value(index);
			}

			yield row;
		}
	}
}
