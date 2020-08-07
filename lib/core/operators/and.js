"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.and = void 0;
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param predicates An arbitory number of predicates, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function and(...predicates) {
    return row => predicates.every(predicate => predicate(row));
}
exports.and = and;
