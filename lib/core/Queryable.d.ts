import { Operator, Row } from './types';
import { IColumn } from './IColumn';
/**
 * Internal base class for tables and queries.
 * @private
 */
export declare abstract class Queryable {
    /**
     * Returns the set of row indexes that fulfil the predicate within the operator if provided.
     */
    abstract indexes(operator: Operator | undefined): Iterable<number>;
    /**
     * Constructs a row object for a given row index and set of columns.
     */
    row(index: number, ...columns: Array<IColumn>): Row;
    /**
     * Selects many rows of data.
     */
    select(...columns: Array<IColumn>): Iterable<Row>;
}
