import { Column } from './Column';
import { Row } from './types';

/**
 * Interface for queryable objects; those that can return an iterable set of rows.
 */
export interface IQueryable extends Iterable<Row> {
	/**
	 * The indexes of the rows from the source that will be returned.
	 */
	indices(): Iterable<number>;

	/**
	 * The columns of the source that will be returned.
	 */
	columns(): Iterable<Column>;
}
