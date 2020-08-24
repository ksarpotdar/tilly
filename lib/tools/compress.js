"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const zlib = require("zlib");
const compressors = [
    {
        name: 'Brotli',
        transform: () => zlib.createBrotliCompress(),
        suffix: '.br'
    },
    {
        name: 'gzip',
        transform: () => zlib.createGzip(),
        suffix: '.gz'
    }
];
const compressor = compressors.find(c => c.name.toLowerCase() === process.argv[3].toLowerCase());
if (compressor) {
    let count = 0;
    let start = new Date();
    // Create read and write streams
    const readStream = fs.createReadStream(process.argv[2]);
    const writeStream = fs.createWriteStream(process.argv[2] + compressor.suffix);
    readStream.on('data', () => {
        if (++count % 10 === 0) {
            const end = new Date();
            console.log(`Processed ${count} 64KiB blocks in ${(end.getTime() - start.getTime()) / 1000}s`);
        }
    });
    // Pipe the read and write operations with brotli compression
    const stream = readStream.pipe(compressor.transform()).pipe(writeStream);
    // Log a message on completion
    stream.on('finish', () => {
        const end = new Date();
        console.log(`Completed conversion in ${(end.getTime() - start.getTime()) / 1000}s`);
    });
}
else {
    console.log(`Compressor ${process.argv[3]} not found;`);
    console.log(`supported compressors: ${compressors.map(c => c.name).join(', ')}`);
}
