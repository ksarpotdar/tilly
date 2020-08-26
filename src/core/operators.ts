import { Supplier, Predicate } from './types';

/**
 * Performs a logical and operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions, all of which must return true for this predicate to return true.
 * @returns Returns the predicate to be used within a query where method.
 */
export function and(...suppliers: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>> {
	return () => {
		const predicates = suppliers.map(supplier => supplier());

		return (index: number) => {
			return predicates.every(predicate => predicate(index));
		}
	};
}

/**
 * Performs a logical or operation of other predicates used within a query.
 * @param suppliers An arbitory number of conditions useable within Query.where.
 * @returns Returns the predicate to be used within a query where method.
 */
export function or(...suppliers: Array<Supplier<Predicate<number>>>): Supplier<Predicate<number>> {
	return () => {
		const predicates = suppliers.map(supplier => supplier());

		return (index: number) => {
			return predicates.some(predicate => predicate(index));
		}
	}
}

/**
 * Performs a logical not operation of other predicates used within a query.
 * @param supplier A predicate whose result with be negated.
 * @returns Returns the predicate to be used within a query where method.
 */
export function not(supplier: Supplier<Predicate<number>>): Supplier<Predicate<number>> {
	return () => {
		const predicate = supplier();

		return (index: number) => {
			return !predicate(index);
		}
	}
}
