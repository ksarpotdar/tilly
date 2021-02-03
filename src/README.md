# Source code
Contains all the TypeScript source code; the entire contents of this folder structure will be transpiled into mirror structure in the lib folder.

|Folder|Content|
|:-|:-|
|core|Contains all the source code for the core Tilly database library.|
|test|Contains tests, also usable as examples.|
|tools|Utilities for creating and managing databases: a tool to convert from CSV files into the Tilly database format; various compression tools.

## TODO
Implement a queryable interface above Table and Query.

Make select, where, etc fluent interfaces on queryable.

Investigate using @steelbreeze/enumerable.