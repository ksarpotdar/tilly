"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
/** Represents a column and its data within a table. */
class Column {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            this.name = p1;
            this.unique = [];
            this.index = [];
        }
        else {
            this.name = p2 || p1.name;
            this.unique = p1.unique;
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
     * @param indexes The set of indexes to insert the value into.
     * @private Package private.
     */
    insert(value, indexes) {
        let position = this.unique.indexOf(value);
        if (position === -1) {
            this.unique[position = this.unique.length] = value;
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
        return this.convert(this.unique[this.index[index]]);
    }
    /**
     * Generates a condition based on a callback to be used within a where clause
     * @param predicate A function that takes the columns value for a row and returns a boolean to indicate if the predicate has been met or not.
     */
    evaluate(predicate) {
        return () => {
            return (index) => {
                return predicate(this.value(index));
            };
        };
    }
    /**
     * Generates a condition to be used in Query.where to filter a column by a list of values.
     * @param values The list of values to filter the column by.
     */
    in(values) {
        return () => {
            const indexes = [];
            for (let i = values.length; i--;) {
                const index = this.unique.indexOf(values[i]);
                if (index !== -1) {
                    indexes.push(index);
                }
            }
            return (index) => {
                return indexes.indexOf(this.index[index]) !== -1;
            };
        };
    }
    /**
     * Generates a condition to be used in the where method of a query to select rows from a table based on equality.
     * @param value The value to test against.
     * @returns Returns the predicate to be used within a query where method.
     */
    equals(value) {
        return () => {
            const position = this.unique.indexOf(value);
            return (index) => {
                return this.index[index] === position;
            };
        };
    }
}
exports.Column = Column;
