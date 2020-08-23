import { Column } from './Column';
import { Row } from './types';
export interface Queryable extends Iterable<Row> {
    indices(): Iterable<number>;
    columns(): Iterable<Column>;
}
