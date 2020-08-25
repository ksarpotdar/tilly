import { Supplier, Predicate } from '../types';

/**
 * Performs a logical or operation of other predicates used within a query.
 * @param conditions An arbitory number of conditions useable within Query.where.
 * @returns Returns the predicate to be used within a query where method.
 */
export function or(...conditions: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>> {
	return () => {
		const predicates = conditions.map(condition => condition());

		return (index) => {
			return predicates.some(predicate => predicate(index));
		}
	}
}
