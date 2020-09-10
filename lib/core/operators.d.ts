import { Operator, Predicate } from './types';
import { IColumn } from './IColumn';
/**
 * Performs an arbitary comparison operation based on a user-supplied callback.
 * @param column The column to test.
 * @param predicate The test condition.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function evaluate(column: IColumn, predicate: Predicate<any>): Operator;
/**
 * Performs a logical and operation of other predicates used within a query.
 * @param operators An arbitory number of operators, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function and(...operators: Array<Operator>): Operator;
/**
 * Performs a logical or operation of other predicates used within a query.
 * @param operators An arbitory number of operators, any of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function or(...operators: Array<Operator>): Operator;
/**
 * Performs a logical not operation of other predicates used within a query.
 * @param operator A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
export declare function not(operator: Operator): Operator;
