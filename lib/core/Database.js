"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const Table_1 = require("./Table");
/**
 * Represents a database consisting of tables.
 */
class Database {
    constructor(param) {
        this.allTables = [];
        if (typeof param === "string") {
            this.name = param;
        }
        else {
            this.name = param.name;
            for (const table of param.allTables) {
                this.add(new Table_1.Table(table));
            }
        }
    }
    /**
     * Adds a table to this database.
     * @param table The able to add to this database.
     */
    add(table) {
        this.allTables.push(table);
        return table;
    }
    /**
     * Finds a table within the database by name.
     * @param name The table name to look for.
     */
    table(name) {
        return this.allTables.filter(table => table.name === name)[0];
    }
}
exports.Database = Database;
