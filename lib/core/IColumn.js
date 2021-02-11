"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnBase = void 0;
class ColumnBase {
    /**
     * Creates a new instance of the common parts of the ColumnBase class
     * @param name The name of the column.
     * @param values The set of distinct, raw values within the column.
     */
    constructor(name, values) {
        this.name = name;
        this.values = values;
        /**
         * A function to convert the returned value to a defined type.
         * @protected
         */
        this.convert = (value) => value;
    }
    /**
     * Adds a conversion function used when retreiving data.
     * @param convert A callback to convert each value on retrieval.
     */
    to(convert) {
        this.convert = convert;
        return this;
    }
}
exports.ColumnBase = ColumnBase;
