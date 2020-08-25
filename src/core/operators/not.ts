import { Supplier, Predicate } from '../types';

/**
 * Performs a logical not operation of other predicates used within a query.
 * @param condition A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
export function not(condition: Supplier<Predicate<number>>): Supplier<Predicate<number>> {
	return () => {
		const predicate = condition();

		return (index: number) => {
			return !predicate(index);
		}
	}
}
