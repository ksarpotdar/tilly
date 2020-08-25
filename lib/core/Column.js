"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            this.name = p1;
            this.distinct = [];
            this.index = [];
        }
        else {
            this.name = p2 || p1.name;
            this.distinct = p1.distinct;
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
     * @param from The first row to insert the value into.
     * @param to The first row not to insert the value into. Start and end provide a range from the start and up to, but not including the end.
     * @private Package private.
     */
    insert(value, from, to) {
        if (from < to) {
            let position = this.distinct.indexOf(value);
            if (position === -1) {
                this.distinct[position = this.distinct.length] = value;
            }
            while (from < to) {
                this.index[from++] = position;
            }
        }
    }
    /**
     * Returns a value from the column for a specific row index.
     * @param index The row index to return.
     * @private Package private.
     */
    value(index) {
        return this.convert(this.distinct[this.index[index]]);
    }
    /**
     * Generates a predicate based on a callback to be used within a where clause
     * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
     */
    evaluate(predicate) {
        return () => (index) => {
            return predicate(this.value(index));
        };
    }
    /**
     * Generates a condition to be used in Query.where to filter a column by a list of values.
     * @param values The list of values to filter the column by.
     */
    in(...values) {
        return () => {
            const indices = [];
            for (let i = values.length; i--;) {
                const index = this.distinct.indexOf(values[i]);
                if (index !== -1) {
                    indices.push(index);
                }
            }
            // Return a function that returns true if the row matches the regex results
            return index => indices.indexOf(this.index[index]) !== -1;
        };
    }
    /**
     * Generates a predicate used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            let position = this.distinct.indexOf(value);
            return (index) => {
                return this.index[index] === position;
            };
        };
    }
}
exports.Column = Column;
