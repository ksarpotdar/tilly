"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = void 0;
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param operators An arbitory number of operators, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function and(...operators) {
    return () => {
        const predicates = operators.map(operator => operator());
        return index => predicates.every(predicate => predicate(index));
    };
}
exports.and = and;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param operators An arbitory number of operators, any of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function or(...operators) {
    return () => {
        const predicates = operators.map(operator => operator());
        return index => predicates.some(predicate => predicate(index));
    };
}
exports.or = or;
/**
 * Performs a logical not operation of other predicates used within a query.
 * @param operator A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
function not(operator) {
    return () => {
        const predicate = operator();
        return index => !predicate(index);
    };
}
exports.not = not;
