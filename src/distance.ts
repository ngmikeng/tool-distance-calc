import { Client } from "@googlemaps/google-maps-services-js";
import { IDistanceResult } from "./model";

export class DistanceCalculator {
  private client;
  private apiKey;
  constructor({ apiKey }) {
    this.apiKey = apiKey;
    this.client = new Client({ });
  }

  async simpleDistance({ fromAddr, toAddrs }: { fromAddr: string, toAddrs: string[] }): Promise<IDistanceResult> {
    try {
      const result = await this.client.distancematrix({
        params: {
          key: this.apiKey,
          origins: [fromAddr],
          destinations: toAddrs
        },
      });
      return result.data;
    } catch (error) {
      console.log('msg', error.message)
      throw error;
    }
  }

}
