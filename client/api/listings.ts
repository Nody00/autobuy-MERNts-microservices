import axiosInstance from "@/config/axiosConfig";

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
    const { data } = await axiosInstance.post("/listings/new-listing", payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(
      `/listings/delete-listing/${id}`
    );
    return data;
  },
  save: async (id: string) => {
    const { data } = await axiosInstance.post(`/listings/save/${id}`);
    return data;
  },
  update: async (id: string, payload: updateListingPayload) => {
    const { data } = await axiosInstance.patch(
      `/listings/update-listing/${id}`,
      payload
    );

    return data;
  },
});
