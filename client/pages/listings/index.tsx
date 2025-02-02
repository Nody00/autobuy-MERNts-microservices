import { useQuery } from "react-query";
import { listingAPI } from "@/api/listings";
import { queryAPI } from "@/api/query";
import ListingCard from "@/components/ListingCard/ListingCard";
import styles from "./listings.module.css";
import { ListingType } from "@/types/listingType";
import Layout from "@/components/Layout/Layout";

export default function Listings() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await queryAPI.getListings({});
    },
    staleTime: 15000,
  });

  if (isLoading) return <p>is loading...</p>;
  console.log("dinov log data", data.data);
  return (
    <Layout>
      <div className={styles.container}>
        {data.data.listings.map((el: ListingType, index: number) => (
          <ListingCard listingData={el} key={index} refetch={refetch} />
        ))}
      </div>
    </Layout>
  );
}
