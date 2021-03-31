import * as path from 'path';
import ProcessFile from './utils/processFile';
import ProcessData from './utils/processData';
import {VirtualDataStream} from './utils/dataStream';

const FILE_PATH = process.argv[2];
const MAX_ELEMENTS = 2;

if (!FILE_PATH) {
  throw new Error('Input file .csv not found');
}
const filePath = path.resolve(FILE_PATH);

const main = async () => {
  const processFile = new ProcessFile({ filePath });
  const data = await processFile.readFilePromise();
  console.log('Data item: ', data[0]);
  // map destination address
  const newData = data.map(item => {
    return {...item, destAddr: `${item.wardName}, ${item.districtName}, Ho Chi Minh City`}
  });
  // process chunk data
  const processData = new ProcessData({ inputData: newData });
  const chunkData = processData.processToChunks({ maxChunk: MAX_ELEMENTS });
  const virtualDataStream = new VirtualDataStream({ chunkData });
  virtualDataStream.pushData();

  virtualDataStream.on('data', (chunk) => {
    console.log('CHUNK DATA', chunk);
  });
  virtualDataStream.on('end', () => {
    console.log('END');
  });
};

main().catch(error => console.log(error.stack));
