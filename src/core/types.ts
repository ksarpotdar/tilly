/**
 * A dictionary keyed on string.
 */
export type Dictionary<TValue> = { [key: string]: TValue };

/**
 * A function taking a value of one type returning another type.
 */
export type Function<TValue, TResult> = (value: TValue) => TResult;

/**
 * A function that takes a value and returns a boolean. Used in the construction of where clauses.
 */
export type Predicate<TValue> = Function<TValue, boolean>;

/**
 * A supplier function, one with no parameters that returns a result.
 */
export type Supplier<TResult> = () => TResult;

/**
 * Represents a row of data; essentially a JavaScript Object with an arbitory number of properties.
 */
export type Row = Dictionary<unknown>;

/**
 * An operator used in queries.
 * @note Operators are evaluated just prior to evaluation.
 */
export type Operator = Supplier<Predicate<number>>;