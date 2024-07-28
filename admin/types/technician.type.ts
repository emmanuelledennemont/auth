export interface Technician {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  bio: string;
  phone: string;
  sirene: string;
  profileImage: string;
  rating: {
    score: number;
    reviews: number;
  };
  address: {
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
    addressLine: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    postalCode: string;
  };
  categories: Array<{
    name: string;
    image: string;
    slug: string;
    sub_categories: any[];
  }>;
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
  }>;
}
