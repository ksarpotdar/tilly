"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    constructor(p1, p2) {
        /** The default value to use if the row being inserted has no value for this column */
        this.defaultValue = undefined;
        if (typeof p1 === "string") {
            this.name = p1;
            this.distinct = [];
            this.index = [];
            this.offset = 0;
        }
        else {
            this.name = p2 || p1.name;
            this.defaultValue = p1.defaultValue;
            this.distinct = p1.distinct;
            this.index = p1.index;
            this.offset = p1.offset;
        }
    }
    /**
     * Creates a column alias with a different name.
     * @param name The alias name for the column.
     * @returns A virtual column.
     */
    as(name) {
        return new Column(this, name);
    }
    /**
     * Allows the column to be converted to a specific type.
     * @param convert A function used to convert to the defined type.
     */
    to(convert) {
        this.convert = convert;
        return this;
    }
    /**
     * Sets the default value of the column if no value is specified when inserting.
     * @note By not specified, we mean that the row that was inserted into the table had no property matching the column name. If there is a property, but with an undefined or null value, the undefined or null value will be stored. If you wish to return default values were undefined or null values are stored, use a convertor specified using the [[as]] method.
     * @param The default value to use.
     */
    default(defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     */
    insert(value) {
        let index = this.distinct.indexOf(value);
        if (index === -1) {
            index = this.distinct.push(value) - 1;
        }
        this.index.push(index);
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     */
    value(index) {
        const val = index < this.offset ? this.defaultValue : this.distinct[this.index[index - this.offset]];
        //		const val = this.distinct[this.index[index]];
        return this.convert ? this.convert(val) : val;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        const index = this.distinct.indexOf(value);
        return row => this.index[row] === index;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
     * @param regex A regular expression that will be tested to select rows.
     * @returns Returns the predicate to be used within a query where method.
     */
    like(regex) {
        const indices = [];
        // determine the indices of the values that match the regular expression
        for (let i = 0, j = this.distinct.length; i < j; ++i) {
            if (regex.test(String(this.distinct[i]))) {
                indices.push(i);
            }
        }
        // Return a function that returns true if the row matches the regex results
        return row => indices.indexOf(this.index[row]) !== -1;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
     * @param values A list of values to test the column against.
     * @returns Returns the predicate to be used within a query where method.
     */
    list(...values) {
        const indices = [];
        // determine the indices of the values in the provided list
        for (let i = 0, j = this.distinct.length; i < j; ++i) {
            if (values.indexOf(this.distinct[i]) !== -1) {
                indices.push(i);
            }
        }
        return row => indices.indexOf(this.index[row]) !== -1;
    }
}
exports.Column = Column;
