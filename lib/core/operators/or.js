"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.or = void 0;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param predicates An arbitory number of predicates, any of which can return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function or(...predicates) {
    return row => predicates.some(predicate => predicate(row));
}
exports.or = or;
