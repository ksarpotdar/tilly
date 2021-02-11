"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
const IColumn_1 = require("./IColumn");
/** Represents a column and its data within a table. */
class Column extends IColumn_1.ColumnBase {
    constructor(name, column) {
        super(name, column ? column.values : []);
        this.index = column ? column.index : [];
    }
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name) {
        return new Column(name, this);
    }
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     * @param indexes The set of indexes to insert the value into.
     * @private Package private.
     */
    insert(value, indexes) {
        let position = this.values.indexOf(value);
        if (position === -1) {
            this.values[position = this.values.length] = value;
        }
        for (const index of indexes) {
            this.index[index] = position;
        }
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     * @private Package private.
     */
    value(index) {
        return this.convert(this.values[this.index[index]]);
    }
    /**
     * Generates an operator to be used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            const position = this.values.indexOf(value);
            return (index) => {
                return this.index[index] === position;
            };
        };
    }
    /**
     * Generates an operator to be used in Query.where to filter a column by a list of values.
     * @param values The list of values to filter the column by.
     */
    in(values) {
        return () => {
            const indexes = [];
            for (let i = values.length; i--;) {
                const index = this.values.indexOf(values[i]);
                if (index !== -1) {
                    indexes.push(index);
                }
            }
            return (index) => {
                return indexes.indexOf(this.index[index]) !== -1;
            };
        };
    }
}
exports.Column = Column;
