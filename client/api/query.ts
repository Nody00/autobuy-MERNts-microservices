import axiosInstance from "@/config/axiosConfig";

interface GetListingParams {
  manufacturer?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  category?: number;
  status?: "available" | "sold";
  isFeatured?: boolean;
  negotiable?: boolean;
  tags?: string;
  sortBy?: "price" | "yearOfProduction" | "mileage" | "createdAt" | "views";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface GetUsersParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isAdmin?: boolean;
  isCustomer?: boolean;
  sortBy?: "email" | "firstName" | "lastName" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const queryAPI = Object.freeze({
  getListings: async (params: GetListingParams) => {
    const { data } = await axiosInstance.get("/query/listing", {
      params: params,
    });
    return data;
  },
  getOneListing: async (id: string) => {
    const { data } = await axiosInstance.get(`/query/listing/${id}`);
    return data;
  },
  getUsers: async (params: GetUsersParams) => {
    const { data } = await axiosInstance.get(`/query/users`, {
      params: params,
    });
    return data;
  },
  getOneUser: async (id: string) => {
    const { data } = await axiosInstance.get(`/query/users/${id}`);
    return data;
  },
});
