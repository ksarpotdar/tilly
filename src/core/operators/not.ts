import { Predicate } from '../types';

/**
 * Performs a logical not operation of other predicates used within a query.
 * @param predicates A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
export function not(predicate: Predicate<number>): Predicate<number> {
	return index => !predicate(index);
}
