import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { createObjectCsvWriter } from 'csv-writer';
import { IDataRow, IProccessFile } from './model';

export default class ProcessFile {
  private filePath;
  constructor({ filePath }: IProccessFile) {
    this.filePath = path.resolve(filePath);
  }

  readFilePromise(): Promise<IDataRow[]> {
    const dataRow = [];
    if (!this.filePath) {
      throw new Error('Input file .csv not found');
    }
    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', row => {
          dataRow.push(row);
        })
        .on('end', (rowCount: number) => {
          console.log(`Parsed ${rowCount} rows`)
          resolve(dataRow);
        });
    });
  }

  async writeFileAsync(header, data) {
    const csvWriter = createObjectCsvWriter({
      path: `${this.filePath}.out.csv`,
      header
    })
    try {
      const result = await csvWriter.writeRecords(data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
