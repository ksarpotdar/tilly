import { Column } from './Column';
import { Row } from './Row';

/**
 * Abstract representation of a queryable object that is an iterator over a number of rows.
 */
export abstract class Queryable implements Iterable<Row> {
	/**
	 * Returns the row indices of rows satisfying the query criteria.
	 * @private Using the absence of a protection modifier to mean package private as Java.
	 */
	abstract indices(): Iterable<number>;

	/**
	 * The columns that will be returned in the rows returned by this query.
	 * @private Using the absence of a protection modifier to mean package private as Java.
	 */
	abstract columns(): Iterable<Column>;

	/**
	 * Executes the query, returning results as a series of rows.
	 * @returns Returns an interable iterator to the result rows. 
	 */
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
	 */
	public [Symbol.iterator](): IterableIterator<Row> {
		return this.run();
	}
}
