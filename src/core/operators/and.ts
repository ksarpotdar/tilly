import { Supplier, Predicate } from '../types';

/**
 * Performs a logical and operation of other predicates used within a query.
 * @param conditions An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export function and(...conditions: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>> {
	return () => {
		const predicates = conditions.map(condition => condition());

		return (index) => {
			return predicates.every(predicate => predicate(index));
		}
	};
}
