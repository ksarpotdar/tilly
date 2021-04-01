"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const zlib = require("zlib");
let count = 0;
const start = new Date();
// Create read and write streams
const readStream = fs.createReadStream(process.argv[2]);
const writeStream = fs.createWriteStream(process.argv[2] + '.br');
readStream.on('data', () => {
    if (++count % 10 === 0) {
        const end = new Date();
        console.log(`Processed ${count} 64KiB blocks in ${(end.getTime() - start.getTime()) / 1000}s`);
    }
});
writeStream.on('close', () => {
    const end = new Date();
    console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
});
// Pipe the read and write operations with brotli compression
readStream.pipe(zlib.createBrotliCompress()).pipe(writeStream);
