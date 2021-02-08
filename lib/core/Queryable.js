"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queryable = void 0;
/**
 * Internal base class for tables and queries.
 * @private
 */
class Queryable {
    /**
     * Constructs a row object for a given row index and set of columns.
     */
    row(index, ...columns) {
        const result = {};
        for (const column of columns) {
            result[column.name] = column.value(index);
        }
        return result;
    }
    /**
     * Selects many rows of data.
     */
    *select(...columns) {
        for (const index of this.indexes(undefined)) {
            yield this.row(index, ...columns);
        }
    }
}
exports.Queryable = Queryable;
