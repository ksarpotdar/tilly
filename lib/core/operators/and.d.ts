import { Supplier, Predicate } from '../types';
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param conditions An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function and(...conditions: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>>;
