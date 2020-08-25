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
     * @private Package private.
     */
    insert(value, start, end) {
        if (start < end) {
            let position = this.values.indexOf(value);
            if (position === -1) {
                this.values[position = this.values.length] = value;
            }
            while (start < end) {
                this.index[start++] = position;
            }
        }
    }
    /**
     * Returns the distinct set of values that could be returned by a call to the value method.
     */
    distinct() {
        return this.values.map(this.convert);
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
     * Generates a predicate based on a callback to be used within a where clause
     * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
     * @returns Returns the predicate to be used within a query where method.
     */
    evaluate(predicate) {
        return () => (index) => {
            return predicate(this.value(index));
        };
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            let position = this.values.indexOf(value);
            return (index) => {
                return this.index[index] === position;
            };
        };
    }
}
exports.Column = Column;
