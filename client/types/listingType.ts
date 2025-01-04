interface Image {
  url: string;
  publicId: string;
  _id: string;
}

export interface ListingType {
  _id: string;
  manufacturer: string;
  model: string;
  yearOfProduction: number;
  mileage: number;
  firstYearOfRegistration: number;
  description: string;
  price: number;
  category: number;
  status: string;
  views: number;
  savedBy: [];
  tags: [];
  version: number;
  images: Image[];
}
