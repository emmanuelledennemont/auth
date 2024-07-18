export interface IAddress {
  addressLine: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  postalCode: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}
