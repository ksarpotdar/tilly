"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = void 0;
/**
 * Function to aggregate a number of predicates using an operation
 * @param suppliers
 * @param operation
 */
function aggregate(suppliers, operation) {
    return () => {
        const predicates = suppliers.map(supplier => supplier());
        return index => operation.call(predicates, predicate => predicate(index));
    };
}
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
function and(...suppliers) {
    return aggregate(suppliers, Array.prototype.every);
}
exports.and = and;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions useable within Query.where.
 * @returns Returns the predicate to be used within a query where method.
 */
function or(...suppliers) {
    return aggregate(suppliers, Array.prototype.some);
}
exports.or = or;
/**
 * Performs a logical not operation of other predicates used within a query.
 * @param supplier A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
function not(supplier) {
    return () => {
        const predicate = supplier();
        return (index) => {
            return !predicate(index);
        };
    };
}
exports.not = not;
