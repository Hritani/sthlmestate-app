interface Coordinate {
    longitud: number;
    latitud: number;
  }
  
  interface Status {
    id: string;
    name: string;
  }
  
  interface Viewing {
    startTime: string;
    endTime: string;
  }
  
  interface MainImage {
    imageId: string;
    dateChanged: string;
    dateChangedImageData: string;
    url: string;
    showImageOnInternet: boolean;
    extension: string;
    cdnReferences: any[];
  }
  
  export interface Estate {
    monthlyFee: number;
    livingSpace: number;
    rooms: number;
    price: number;
    id: string;
    status: Status;
    customerId: string;
    areaName: string | null;
    dateChanged: string;
    streetAddress: string;
    coordinate: Coordinate;
    shortSaleDescription: string;
    viewingsList: Viewing[];
    bidding: boolean;
    objectNumber: string;
    mainImage: MainImage;
    offerSentDate: string | null;
  }

  export interface EstatesListRaw {
    customerId: string,
    houses: Estate[],
    cottages: Estate[],
    housingCooperativeses: Estate[],
    plots: Estate[],
    projects: Estate[],
    farms: Estate[],
    commercialPropertys: Estate[],
    condominiums: Estate[],
    foreignProperties: Estate[],
    premises: Estate[]
}