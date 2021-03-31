import { Readable } from "stream";

export class VirtualDataStream extends Readable {
  private chunkData = [];
  private delayInMilliseconds = 1000;

  constructor({ chunkData = [], delayInMilliseconds = 1000 }) {
    super({ objectMode: true });

    this.chunkData = chunkData;
    this.delayInMilliseconds = delayInMilliseconds;
  }

  async pushData() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const chunk of this.chunkData) {
      // push to stream
      this.push(chunk);
      await delay(this.delayInMilliseconds);
    }
    // end of data
    this.push(null);
  }

  _read() {}
}
