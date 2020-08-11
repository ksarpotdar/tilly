import { Queryable } from './Queryable';
import { Column } from './Column';

/**
 * Represents a query used to select a subset of the rows and columns of a table.
 */
export class Query extends Queryable {
	/**
	 * The predicate that this query will use to restrict the number of rows from source table.
	 */
	private predicate: (index: number) => boolean;

	/**
	 * The columns that will be returned by this query.
	 */
	private allColumns: Iterable<Column> = [];

	/**
	 * Created a new instance of the query class.
	 * @param queryable Another queryable object to use as the source for this query.
	 */
	public constructor(queryable: Queryable) {
		super(queryable);

		this.predicate = () => true;
	}

	/**
	 * Defines the columns that will be returned by this query.
	 * @param columns The set of columns from the underlying soure that will be returned by this query.
	 */
	public select(...columns: Column[]): this {
		this.allColumns = columns;

		return this;
	}

	/**
	 * Defines the filter critera that will be applied to rows retrieved from the source.
	 * @param predicate A boolean predicate built using the supplied column oriented predicates ([[equals]], [[list]], [[like]], [[and]], [[or]], etc.).
	 */
	public where(predicate: (row: number) => boolean): this {
		this.predicate = predicate;

		return this;
	}

	/**
	 * Returns the set of columns that this query will return when executed.
	 * @private
	 */
	columns(): Iterable<Column> {
		return this.allColumns;
	}

	/**
	 * Returns the row indices that this query will return when executed.
	 * @private
	 */
	*indices(): Iterable<number> {
		if (this.source) {
			for (const index of this.source) {
				if (this.predicate(index)) {
					yield index;
				}
			}
		}
	}
}
