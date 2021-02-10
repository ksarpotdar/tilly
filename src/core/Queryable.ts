import { Operator, Row } from './types';
import { IColumn } from './IColumn';

/**
 * Internal base class for tables and queries.
 * @private
 */
export abstract class Queryable {
	/**
	 * Returns the set of row indexes that fulfil the predicate within the operator if provided.
	 */
	abstract indexes(operator?: Operator): Iterable<number>;

	/**
	 * Constructs a row object for a given row index and set of columns.
	 */
	public row(index: number, ...columns: Array<IColumn>): Row {
		const result: Row = {};

		for (const column of columns) {
			result[column.name] = column.value(index);
		}

		return result;
	}

	/**
	 * Selects many rows of data.
	 */
	public * select(...columns: Array<IColumn>): Iterable<Row> {
		for (const index of this.indexes()) {
			yield this.row(index, ...columns);
		}
	}
}
