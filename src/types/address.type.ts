export interface IAddress {
  addressLine: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
