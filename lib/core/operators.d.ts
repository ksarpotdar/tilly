import { Supplier, Predicate } from './types';
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function and(...suppliers: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>>;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions useable within Query.where.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function or(...suppliers: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>>;
/**
 * Performs a logical not operation of other predicates used within a query.
 * @param supplier A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function not(supplier: Supplier<Predicate<number>>): Supplier<Predicate<number>>;
