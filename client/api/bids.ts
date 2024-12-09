import axiosInstance from "@/config/axiosConfig";

interface newBidPayload {
  listingId: string;
  amount: number;
}

export const bidsAPI = Object.freeze({
  createBid: async (payload: newBidPayload) => {
    const { data } = await axiosInstance.post("/bids/new", payload);
    return data;
  },
});
