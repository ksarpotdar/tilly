"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    /**
     * Creates a new instance of the Column class, if another column is specified, acts as a copy constructor.
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
        // find the position of the value in the set of distinct values
        let position = this.values.indexOf(value);
        // if not found, add it to the set of distinct values
        if (position === -1) {
            this.values[position = this.values.length] = value;
        }
        // update the index with the position
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
        // extract the value as inserted
        const value = this.values[this.index[index]];
        // if there is a conversion function, apply it, otherwide return the raw value
        return this.convert ? this.convert(value) : value;
    }
    /**
     * Generates an operator to be used in a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            // find the position of the value within the distinct set
            const position = this.values.indexOf(value);
            // return a Predicate that will filter rows as required
            return index => this.index[index] === position;
        };
    }
    /**
     * Generates an operator to be used in Query.where to filter a column by a list of values.
     * @param values The list of values to filter the column by.
     */
    in(values) {
        return () => {
            const positions = values.map(value => this.values.indexOf(value));
            return index => positions.includes(this.index[index]);
        };
    }
    /**
     * Generates and operator to e used in a query; performs an arbitary comparison operation based on a user-supplied callback.
     * @param predicate The test condition.
     * @returns Returns the predicate to be used within a query method.
     */
    evaluate(predicate) {
        return () => {
            return index => predicate(this.values[this.index[index]]);
        };
    }
}
exports.Column = Column;
