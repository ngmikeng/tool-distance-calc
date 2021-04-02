import Config from './.config';
import { DistanceCalculator } from './utils/distance';
import ProcessFile from './utils/processFile';

const FILE_PATH = process.argv[2];
const MAX_ELEMENTS = 10;

if (!FILE_PATH) {
  throw new Error('Input file .csv not found');
}

const main = async () => {
  console.log('API-KEY', Config.apiKey);
  const distanceCalc = new DistanceCalculator({ apiKey: Config.apiKey });
  const processFile = new ProcessFile({ filePath: FILE_PATH });
  const data = await processFile.readFilePromise();
  console.log('Data item: ', data[0]);
  // map destination address
  const newData = data.map(item => {
    return {...item, destAddr: `${item.wardName}, ${item.districtName}, Ho Chi Minh City`}
  });
  console.log(`Processing calculate distance...`);
  // calc by chunk because limit quota 100 elements per request
  let startIndex = 0;
  let curChunk = newData.slice(startIndex, MAX_ELEMENTS);
  const chunks = [curChunk];
  while (curChunk.length) {
    startIndex = startIndex + MAX_ELEMENTS;
    const lastIndex = startIndex + MAX_ELEMENTS;
    curChunk = newData.slice(startIndex, lastIndex);
    if (curChunk.length) {
      chunks.push(curChunk);
    }
  }
  // call google api distance matrix
  let outData = [];
  const promises = chunks.map(async chunkData => {
    const distanceResult = await distanceCalc.simpleDistance({
      fromAddr: 'LOTTE Mart Quận 7, Đường Nguyễn Hữu Thọ, Tân Hưng, District 7, Ho Chi Minh City',
      toAddrs: chunkData.map(item => item.destAddr)
    });
    const destAddrs = distanceResult.destination_addresses;
    const originAddr = distanceResult.origin_addresses[0];
    const distElements = distanceResult.rows[0].elements;
    console.log('Distance Result', JSON.stringify(distanceResult));
    // write new file csv
    const chunkNewData = chunkData.map((item, index) => {
      let ggDistance = 'UNKNOWN', ggDuration = 'UNKNOWN';
      if (distElements[index] && distElements[index].status === 'OK') {
        ggDistance = distElements[index].distance.text;
        ggDuration = distElements[index].duration.text
      }
      return {
        ...item,
        ggOriginAddr: originAddr,
        ggDestAddr: destAddrs[index],
        ggDistance,
        ggDuration
      };
    });
    outData = outData.concat(chunkNewData);
    return chunkNewData;
  });
  await Promise.all(promises);
  // handle write file
  console.log('Out data item: ', outData[0]);
  const header = Object.keys(outData[0]).map(value => {
    return { id: value, title: value }
  })
  const result = await processFile.writeFileAsync(header, outData);
  console.log('Write new file done!');
};

main().catch(error => console.log(error.stack));
