import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import TimedQueue from './timedQueue';
import ProcessFile from './processFile';

const FILE_PATH = process.argv[2];

if (!FILE_PATH) {
  throw new Error('Input file .csv not found');
}

const timedQueue = TimedQueue.getInstance();
const filePath = path.resolve(FILE_PATH);

const main = async () => {
  const processFile = new ProcessFile({ filePath: FILE_PATH });
  const data = await processFile.readFilePromise();
  const newData = data.map(item => {
    return {...item, destAddr: `${item.wardName}, ${item.districtName}, Ho Chi Minh`}
  });
  const header = Object.keys(newData[0]).map(value => {
    return { id: value, title: value }
  })
  console.log('Data item: ', data[0]);
  const result = await processFile.writeFileAsync(header, newData);
  console.log('Write new file done!');
};

main().catch(error => console.log(error));

// fs.createReadStream(filePath)
//   .pipe(csv.parse({ headers: true }))
//   .on('error', error => console.error(error))
//   .on('data', row => {
//     console.log(row);
//     timedQueue.addTask({
//       callback: () => {
//         console.log(`processing ${row.id}-${row.name} in 1 seconds`);
//       },
//       time: 1000
//     })
//   })
//   .on('end', (rowCount: number) => {
//     console.log(`Parsed ${rowCount} rows`)
//     timedQueue.start();
//   });
