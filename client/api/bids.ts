import axios from "axios";

interface newBidPayload {
  listingId: string;
  amount: number;
}

export const bidsAPI = Object.freeze({
  createBid: async (payload: newBidPayload) => {
    const { data } = await axios.post("/bids/new", payload);
    return data;
  },
});
