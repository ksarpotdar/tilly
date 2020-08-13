"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Queryable_1 = require("./Queryable");
const Column_1 = require("./Column");
/**
 * Represents a table of data, comprising a number of columns.
 */
class Table extends Queryable_1.Queryable {
    constructor(param) {
        super();
        this.allColumns = [];
        if (typeof param === "string") {
            this.name = param;
            this.rowCount = 0;
        }
        else {
            this.name = param.name;
            this.rowCount = param.rowCount;
            for (const column of param.allColumns) {
                this.allColumns.push(new Column_1.Column(column));
            }
        }
    }
    /**
     * Adds a new column to the table
     * @param column The new column to add.
     */
    add(column) {
        // add the column to the table
        this.allColumns.push(column);
        // add entries for exissting rows
        column.insert(undefined, 0, this.rowCount);
        return column;
    }
    /**
     * Adds a new row of data to the table
     * @param row The row of data to add
     */
    insert(row) {
        for (const column of this.allColumns) {
            column.insert(row[column.name], this.rowCount, 1);
        }
        this.rowCount++;
    }
    /**
     * Returns the table coumn of the given name.
     * @param name The name of the column to find.
     */
    column(name) {
        return this.allColumns.find(col => col.name === name);
        //		return this.allColumns.filter(column => column.name === name)[0];
    }
    /**
     * Returns the indexes of all rows in the table.
     */
    *indices() {
        for (let index = 0, length = this.rowCount; index < length; ++index) {
            yield index;
        }
    }
    /**
     * Returns all the columns within the table.
     */
    columns() {
        return this.allColumns;
    }
}
exports.Table = Table;
