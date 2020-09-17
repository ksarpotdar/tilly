/**
 * A dictionary keyed on string.
 */
export declare type Dictionary<TValue> = {
    [key: string]: TValue;
};
/**
 * A function taking a value of one type returning another type.
 */
export declare type Function<TValue, TResult> = (value: TValue) => TResult;
/**
 * A function that takes a value and returns a boolean. Used in the construction of where clauses.
 */
export declare type Predicate<TValue> = Function<TValue, boolean>;
/**
 * A supplier function, one with no parameters that returns a result.
 */
export declare type Supplier<TResult> = () => TResult;
/**
 * Represents a row of data; essentially a JavaScript Object with an arbitory number of properties.
 */
export declare type Row = Dictionary<unknown>;
/**
 * An operator used in queries.
 * @note Operators are evaluated just prior to evaluation.
 */
export declare type Operator = Supplier<Predicate<number>>;
