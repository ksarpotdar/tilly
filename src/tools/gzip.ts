import fs = require('fs');
import zlib = require('zlib');

let start: Date = new Date();

// Create read and write streams
const readStream = fs.createReadStream(process.argv[2]);
const writeStream = fs.createWriteStream(process.argv[2] + '.gz');

// Pipe the read and write operations with brotli compression
const stream = readStream.pipe(zlib.createGzip()).pipe(writeStream);

// Log a message on completion
stream.on('finish', () => {
	const end = new Date();

	console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
});