# Tools
Contains some utility tools for converting data into the format used by cdb.

|Tool|Use|
|:-|:-|
|csv|Reads a CSV file, specified by the first paramater, creates a column for each value in first (header) row, then a row for each subsiquent row. Saves the resultant database in a file specified by the second parameter. The format of the resultant file is JSON. The database will be called 'database' and the single table created from the CSV data will be called 'table'.|
|brotli|Compresses a file using Brotli compresion (very good for text, and consiquently, JSON files. Appends .br to the filename of the source file specified by the first parameter).|
|gzip|Compresses a file using gzip compresion (very good for text, and consiquently, JSON files. Appends .gz to the filename of the source file specified by the first parameter).|
