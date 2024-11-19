export interface newBidEvent {
  userId: string;
  listingId: string;
  amount: number;
  _id: string;
  operation: "create" | "update" | "delete";
}
