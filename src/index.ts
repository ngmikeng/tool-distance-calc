import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import TimedQueue from './timedQueue';

const FILE_PATH = process.argv[2];

if (!FILE_PATH) {
  throw new Error('Input file .csv not found');
}

const timedQueue = TimedQueue.getInstance();
const filePath = path.resolve(FILE_PATH);
fs.createReadStream(filePath)
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', row => {
    console.log(row);
    timedQueue.addTask({
      callback: () => {
        console.log(`processing ${row.id}-${row.name} in 1 seconds`);
      },
      time: 1000
    })
  })
  .on('end', (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`)
    timedQueue.start();
  });
