/**
 * A function that takes a value and returns a boolean. Used in the construction of where clauses.
 */
export type Predicate<TValue> = (value: TValue) => boolean;