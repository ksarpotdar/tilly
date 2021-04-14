import { Column } from './Column';
import { Operator, Row } from './types';
import { and } from './operators';
import { Table } from './Table';

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query {
	/**
	 * Created a new instance of the query class.
	 * @param source Another queryable object to use as the source for this query.
	 * @param operator The operator that will create the predicate that this query will use to restrict the number of rows from source table.
	 */
	public constructor(private readonly source: Query | Table, private readonly operator: Operator<number>) {
	}

	/**
	 * Creates a query to furthre filter the contents of the query based on another predicate.
	 * @param operator An Operator object that creates the filter predicate at query execution time.
	 */
	public where(operator: Operator<number>): Query {
		return new Query(this, operator);
	}

	/**
	 * Tests the query to see if it contains any result rows.
	 */
	public exists(): boolean {
		// get an iterator and see if it has an initial result
		return !this.indexes().next().done;
	}

	/**
	 * Returns the indexes of all rows in the query with an optional filter criteria.
	 * @private
	 */
	indexes(operator?: Operator<number>): IterableIterator<number> {
		// propigate this and any additional operators to the underlying table to query
		return this.source.indexes(operator ? and(operator, this.operator) : this.operator);
	}

	/**
	 * Selects many rows of data.
	 */
	 public * select(...columns: Array<Column>): IterableIterator<Row> {
		for (const index of this.source.indexes(this.operator)) {
			yield Object.fromEntries(columns.map(column => [column.name, column.value(index)]));
		}
	}
}
