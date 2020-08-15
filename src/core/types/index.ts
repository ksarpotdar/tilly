/**
 * A function that takes a index and returns a boolean. Used in the construction of where clauses.
 */
export type Predicate = (index: number) => boolean;