/**
 * A function taking a value of one type returning another type.
 */
export declare type Function<TValue, TResult> = (value: TValue) => TResult;
/**
 * A function that takes a value and returns a boolean. Used in the construction of where clauses.
 */
export declare type Predicate<TValue> = Function<TValue, boolean>;
