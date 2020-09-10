"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = exports.evaluate = void 0;
/**
 * Performs an arbitary comparison operation based on a user-supplied callback.
 * @param column The column to test.
 * @param predicate The test condition.
 * @returns Returns the predicate to be used within a query where method.
 */
function evaluate(column, predicate) {
    return () => index => predicate(column.value(index));
}
exports.evaluate = evaluate;
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param operators An arbitory number of operators, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function and(...operators) {
    return () => {
        const predicates = operators.map(supplier => supplier());
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
        const predicates = operators.map(supplier => supplier());
        return (index) => {
            return predicates.some(predicate => predicate(index));
        };
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
        return (index) => {
            return !predicate(index);
        };
    };
}
exports.not = not;
