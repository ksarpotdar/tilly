"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const zlib = require("zlib");
let count = 0;
let start = new Date();
// Create read and write streams
const readStream = fs.createReadStream(process.argv[2]);
const writeStream = fs.createWriteStream(process.argv[2] + '.gz');
readStream.on('data', () => {
    if (++count % 100 === 0) {
        const end = new Date();
        console.log(`Processed ${count} blocks in ${(end.getTime() - start.getTime()) / 1000}s`);
    }
});
// Pipe the read and write operations with brotli compression
const stream = readStream.pipe(zlib.createGzip()).pipe(writeStream);
// Log a message on completion
stream.on('finish', () => {
    const end = new Date();
    console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
});
