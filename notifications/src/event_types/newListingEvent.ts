export interface newListingEvent {
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
  saves: [];
  tags: [];
  userId: string;
  deleted: boolean;
  version: number;
  _id: string;
  operation: "create" | "update" | "delete";
}
