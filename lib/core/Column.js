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
            this.values = [];
            this.index = [];
            this.offset = 0;
        }
        else {
            this.name = p2 || p1.name;
            this.defaultValue = p1.defaultValue;
            this.values = p1.values;
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
    insert(value, start) {
        const val = value !== undefined ? value : this.defaultValue;
        let position = this.values.indexOf(val);
        if (position === -1) {
            position = this.values.push(val) - 1;
        }
        this.index[start - this.offset] = position;
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     */
    value(index) {
        const val = index < this.offset ? this.defaultValue : this.values[this.index[index - this.offset]];
        return this.convert ? this.convert(val) : val;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        const position = this.values.indexOf(value);
        return index => this.index[index] === position;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
     * @param regex A regular expression that will be tested to select rows.
     * @returns Returns the predicate to be used within a query where method.
     */
    like(regex) {
        const positions = [];
        // determine the indices of the values that match the regular expression
        for (let i = 0, j = this.values.length; i < j; ++i) {
            if (regex.test(String(this.values[i]))) {
                positions.push(i);
            }
        }
        // Return a function that returns true if the row matches the regex results
        return index => positions.indexOf(this.index[index]) !== -1;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
     * @param values A list of values to test the column against.
     * @returns Returns the predicate to be used within a query where method.
     */
    list(...values) {
        const positions = [];
        // determine the indices of the values in the provided list
        for (let i = 0, j = this.values.length; i < j; ++i) {
            if (values.indexOf(this.values[i]) !== -1) {
                positions.push(i);
            }
        }
        return index => positions.indexOf(this.index[index]) !== -1;
    }
}
exports.Column = Column;
