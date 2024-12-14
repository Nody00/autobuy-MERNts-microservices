import axios from "axios";
import { useQuery } from "react-query";
import { listingAPI } from "@/api/listings";
import { queryAPI } from "@/api/query";

import styles from "./home.module.css";
import { MainNavigation } from "@/components/MainNavigation/MainNavigation";
import { TopSearchBar } from "@/components/TopSearchBar/TopSearchBar";
import { MainContentWrapper } from "@/components/MainContentWrapper/MainContentWrapper";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      return await queryAPI.getListings({});
    },
  });
  console.log("dinov log data", data);
  if (isLoading) return <p>is loading...</p>;

  return (
    <div className={styles.container}>
      <MainNavigation />
      <TopSearchBar />
      <MainContentWrapper />
      {/* regular users should be able to only see the listings while the admins can see the dashboard for data reporting */}
    </div>
  );
}
