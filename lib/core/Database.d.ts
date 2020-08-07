import { Table } from './Table';
/**
 * Represents a database consisting of tables.
 */
export declare class Database {
    /** The name of the database. */
    readonly name: string;
    /** All the tables belonging to this database */
    private allTables;
    /**
     * Creates a new instance of the Database class.
     * @param name The name of the database.
     */
    constructor(name: string);
    /**
     * Creates a new instance of the Database class.
     * @param column Another database to copy as a baseline.
     */
    constructor(column: any, name?: string);
    /**
     * Adds a table to this database.
     * @param table The able to add to this database.
     */
    add(table: Table): Table;
    /**
     * Finds a table within the database by name.
     * @param name The table name to look for.
     */
    table(name: string): Table;
}
