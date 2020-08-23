import { Column } from './Column';
/**
 * Interface for queryable objects; those that can return an iterable set of rows.
 */
export interface IQueryable {
    /**
     * The indexes of the rows from the source that will be returned.
     */
    indices(): Iterable<number>;
    /**
     * The columns of the source that will be returned.
     */
    columns(): Iterable<Column>;
}
