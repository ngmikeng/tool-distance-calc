
export interface IDataRow {
  no: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
}

export interface IProccessFile {
  filePath: string;
}

export interface IDistanceElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}

export interface IDistanceResult {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: { elements: IDistanceElement[] }[];
  status: string;
}
