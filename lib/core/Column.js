"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            this.name = p1;
            this.values = [];
            this.index = [];
        }
        else {
            this.name = p2 || p1.name;
            this.values = p1.values;
            this.index = p1.index;
        }
        this.convert = (value) => value;
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
     * @return Fluent API call, so returns this.
     */
    to(convert) {
        this.convert = convert;
        return this;
    }
    /**
     * Inserts a new row into the column.
     * @param value The value to add.
     * @param start The first row to insert the value into.
     * @param end The first row not to insert the value into. Start and end provide a range from the start and up to, but not including the end.
     */
    insert(value, start, end) {
        let position = this.values.indexOf(value);
        if (position === -1) {
            this.values[position = this.values.length] = value;
        }
        while (start < end) {
            this.index[start++] = position;
        }
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     */
    value(index) {
        return this.convert(this.values[this.index[index]]);
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
     * Generates a predicate used in the where method of a query to select rows from a table less than a specified value.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    lessThan(value) {
        return index => this.value(index) < value;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table greater than a specified value.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    greaterThan(value) {
        return index => this.value(index) > value;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are like the regular expression provided.
     * @param regex A regular expression that will be tested to select rows.
     * @returns Returns the predicate to be used within a query where method.
     */
    like(regex) {
        const indices = [];
        for (let i = this.values.length; --i;) {
            if (regex.test(String(this.values[i]))) {
                indices.push(i);
            }
        }
        // Return a function that returns true if the row matches the regex results
        return index => indices.indexOf(this.index[index]) !== -1;
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based where values are in the list provided.
     * @param values A list of values to test the column against.
     * @returns Returns the predicate to be used within a query where method.
     */
    in(...values) {
        const indices = [];
        for (let i = this.values.length; --i;) {
            if (values.indexOf(this.values[i]) !== -1) {
                indices.push(i);
            }
        }
        // Return a function that returns true if the row matches the regex results
        return index => indices.indexOf(this.index[index]) !== -1;
    }
}
exports.Column = Column;
