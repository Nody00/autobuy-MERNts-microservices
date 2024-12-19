import { useQuery } from "react-query";
import { listingAPI } from "@/api/listings";
import { queryAPI } from "@/api/query";

import styles from "./listings.module.css";

import Layout from "@/components/Layout/Layout";

export default function Listings() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await queryAPI.getListings({});
    },
  });
  console.log("dinov log data", data);
  if (isLoading) return <p>is loading...</p>;

  return (
    <Layout>
      <div>listings page test</div>
    </Layout>
  );
}
