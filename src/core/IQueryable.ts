/**
 * Interface for queryable objects; those that can return an iterable set of rows.
 */
export interface IQueryable {
	/**
	 * The indexes of the rows from the source that will be returned.
	 */
	indices(): Iterable<number>;
}
