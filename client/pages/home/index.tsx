import axios from "axios";
import { useQuery } from "react-query";
import { listingAPI } from "@/api/listings";
import { queryAPI } from "@/api/query";
export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await queryAPI.getListings({});
    },
  });
  console.log("dinov log data", data);
  if (isLoading) return <p>is loading...</p>;

  return <div>home</div>;
}
