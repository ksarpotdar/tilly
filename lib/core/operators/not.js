"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = void 0;
/**
 * Performs a logical not operation of other predicates used within a query.
 * @param predicates A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
function not(predicate) {
    return row => !predicate(row);
}
exports.not = not;
