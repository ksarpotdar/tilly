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
	public constructor(private readonly source: Query | Table, private readonly operator: Operator) {
	}

	/**
	 * Creates a query to furthre filter the contents of the query based on another predicate.
	 * @param operator An Operator object that creates the filter predicate at query execution time.
	 */
	public where(operator: Operator): Query {
		return new Query(this, operator);
	}

	/**
	 * Tests the query to see if it contains any result rows.
	 */
	public exists(): boolean {
		for (const index of this.indexes()) {
			return true;
		}

		return false;
	}

	/**
	 * Selects many rows of data.
	 */
	public * select(...columns: Array<Column>): Iterable<Row> {
		for (const index of this.indexes()) {
			yield Object.fromEntries(columns.map(column => [column.name, column.value(index)]));
		}
	}

	/**
	 * Returns the indexes of all rows in the query with an optional filter criteria.
	 * @private
	 */
	indexes(operator?: Operator): Iterable<number> {
		return this.source.indexes(operator ? and(operator, this.operator) : this.operator);
	}
}
