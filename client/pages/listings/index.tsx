import { useQuery } from "react-query";
import { listingAPI } from "@/api/listings";
import { queryAPI } from "@/api/query";
import ListingCard from "@/components/ListingCard/ListingCard";
import styles from "./listings.module.css";
import { ListingType } from "@/types/listingType";
import Layout from "@/components/Layout/Layout";

export default function Listings() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await queryAPI.getListings({});
    },
  });

  if (isLoading) return <p>is loading...</p>;

  return (
    <Layout>
      <div className={styles.container}>
        {data.data.listings.map((el: ListingType, index: number) => (
          <ListingCard listingData={el} key={index} />
        ))}
      </div>
    </Layout>
  );
}
