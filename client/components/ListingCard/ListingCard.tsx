import { ListingType } from "@/types/listingType";
import styles from "./ListingCard.module.css";

export default function ListingCard({
  listingData,
}: {
  listingData: ListingType;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.imageBox}></div>
      <div className={styles.infoBox}></div>
      <div className={styles.controlBox}></div>
    </div>
  );
}
