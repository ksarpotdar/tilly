"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.or = void 0;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param conditions An arbitory number of conditions useable within Query.where.
 * @returns Returns the predicate to be used within a query where method.
 */
function or(...conditions) {
    return () => {
        const predicates = conditions.map(condition => condition());
        return (index) => {
            return predicates.some(predicate => predicate(index));
        };
    };
}
exports.or = or;
