
export default class ProcessData {
  private inputData = [];

  constructor({ inputData = [] }) {
    this.inputData = inputData;
  }

  processToChunks({ maxChunk = 10 }) {
    let startIndex = 0;
    let curChunk = this.inputData.slice(startIndex, maxChunk);
    const chunks = [curChunk];
    while (curChunk.length) {
      startIndex = startIndex + maxChunk;
      const lastIndex = startIndex + maxChunk;
      curChunk = this.inputData.slice(startIndex, lastIndex);
      if (curChunk.length) {
        chunks.push(curChunk);
      }
    }

    return chunks;
  }
}

