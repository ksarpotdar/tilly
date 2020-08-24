# Tools
Contains some utility tools for converting data into the format used by Tilly.

|Tool|Use|
|:-|:-|
|csv|Reads a CSV file, specified by the first paramater, creates a column for each value in first (header) row, then a row for each subsiquent row. Saves the resultant database in a file specified by the second parameter. The format of the resultant file is JSON. The database will be called 'database' and the single table created from the CSV data will be called 'table'.|
|compress|Compresses a file using a specified compresion method (Brotli or gzip at present). Creates a compressed file with an appropriate suffix for the type of compression used).|
