"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const IColumn_1 = require("./IColumn");
/**
 * A primary key is a type of column where all the values are known to be unique.
 */
class Key extends IColumn_1.ColumnBase {
    constructor(name, p2) {
        super(name, typeof p2 === 'boolean' ? [] : p2.values);
        this.unique = typeof p2 === 'boolean' ? p2 : p2.unique;
    }
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name) {
        return new Key(name, this);
    }
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     * @param indexes The set of indexes to insert the value into.
     * @private Package private.
     */
    insert(value, indexes) {
        for (const index of indexes) {
            if (this.unique && this.values.indexOf(value) !== -1) {
                throw Error(`Unique constraint violation for key ${this.name} while inserting value ${value}`);
            }
            this.values[index] = value;
        }
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     * @private Package private.
     */
    value(index) {
        return this.convert(this.values[index]);
    }
    /**
     * Generates a condition to be used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns an operator to be used within a query where method.
     */
    equals(value) {
        return () => {
            return (index) => {
                return this.values[index] === value;
            };
        };
    }
    /**
     * Creates and operator to test if a rows value is in a set of values.
     * @param value The value to test equality for.
     */
    in(values) {
        return () => {
            return (index) => {
                return values.indexOf(this.values[index]) !== -1;
            };
        };
    }
}
exports.Key = Key;
