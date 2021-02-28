"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    /**
     * Copy constructor; creates a new instance of the Column class from another object with the same values.
     * @param name The name of the column.
     * @param column Another column to copy as a baseline.
     */
    constructor(name, column) {
        this.name = name;
        this.values = column ? column.values : [];
        this.index = column ? column.index : [];
    }
    /**
     * Creates a column alias with a different name.
     * The underlying column data are shared between the origional column and the alias.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name) {
        return new Column(name, this);
    }
    /**
     * Adds a conversion function used when retreiving data.
     * @param convert A callback to convert each value on retrieval.
     */
    to(convert) {
        this.convert = convert;
        return this;
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
            position = this.values.push(value) - 1;
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
        const raw = this.values[this.index[index]];
        return this.convert ? this.convert(raw) : raw;
    }
    /**
     * Generates an operator to be used in a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            const position = this.values.indexOf(value);
            return (index) => this.index[index] === position;
        };
    }
    /**
     * Generates an operator to be used in Query.where to filter a column by a list of values.
     * @param values The list of values to filter the column by.
     */
    in(values) {
        return () => {
            const indexes = values.map(value => this.values.indexOf(value));
            return (index) => indexes.indexOf(this.index[index]) !== -1;
        };
    }
    /**
     * Generates and operator to e used in a query; performs an arbitary comparison operation based on a user-supplied callback.
     * @param predicate The test condition.
     * @returns Returns the predicate to be used within a query method.
     */
    evaluate(predicate) {
        return () => (index) => predicate(this.value(index));
    }
}
exports.Column = Column;
