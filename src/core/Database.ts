import { Table } from './Table';

/**
 * Represents a database consisting of tables.
 */
export class Database {
	/** The name of the database. */
	public readonly name: string;

	/** All the tables belonging to this database */
	private allTables: Array<Table> = [];

	/**
	 * Creates a new instance of the Database class.
	 * @param name The name of the database.
	 */
	public constructor(name: string);

	/**
	 * Creates a new instance of the Database class.
	 * @param column Another database to copy as a baseline.
	 */
	public constructor(column: any, name?: string);
	public constructor(param: any) {
		if (typeof param === "string") {
			this.name = param;
		} else {
			this.name = param.name;

			for (const table of param.allTables) {
				this.add(new Table(table));
			}
		}
	}

	/**
	 * Adds a table to this database.
	 * @param table The able to add to this database.
	 */
	public add(table: Table): Table {
		this.allTables.push(table);

		return table;
	}

	/**
	 * Finds a table within the database by name.
	 * @param name The table name to look for.
	 */
	public table(name: string): Table {
		return this.allTables.filter(table => table.name === name)[0];
	}
}