import axios from "axios";

interface createListingPayload {
  images: File[];
  manufacturer: string;
  model: string;
  yearOfProduction: number;
  mileage: number;
  firstYearOfRegistration: number;
  description: string;
  price: number;
  endBiddingAt: Date;
  category: number;
}

interface updateListingPayload {
  manufacturer?: string;
  model?: string;
  yearOfProduction?: number;
  mileage?: number;
  firstYearOfRegistration?: number;
  description?: string;
  price?: number;
  endBiddingAt?: Date;
  category?: number;
}

export const listingAPI = Object.freeze({
  create: async (payload: createListingPayload) => {
    const { data } = await axios.post("/listings/new-listing", payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await axios.delete(`/listings/delete-listing/${id}`);
    return data;
  },
  save: async (id: string) => {
    const { data } = await axios.post(`/listings/save/${id}`);
    return data;
  },
  update: async (id: string, payload: updateListingPayload) => {
    const { data } = await axios.patch(
      `/listings/update-listing/${id}`,
      payload
    );

    return data;
  },
});
