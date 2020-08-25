"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.and = void 0;
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param conditions An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function and(...conditions) {
    return () => {
        const predicates = conditions.map(condition => condition());
        return (index) => {
            return predicates.every(predicate => predicate(index));
        };
    };
}
exports.and = and;
