import { ListingType } from "@/types/listingType";
import styles from "./ListingCard.module.css";
import { useMemo, useState } from "react";
import { LeftChevron } from "@/icons/LeftChevron";
import { RightChevron } from "@/icons/RightChevron";
import { OpenDetailsIcon } from "@/icons/OpenDetailsIcon";
import { HeartIcon } from "@/icons/HeartIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { useRouter } from "next/navigation";
import { RedHeartIcon } from "@/icons/RedHeartIcon";
import { useAuthStore } from "@/stores/authStore";
import { listingAPI } from "@/api/listings";

export default function ListingCard({
  listingData,
  refetch,
}: {
  listingData: ListingType;
  refetch: () => {};
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = useAuthStore((state) => state.user);
  const [showButtons, setShowButtons] = useState(false);
  const images = listingData.images || [];
  const totalImages = images.length;
  const router = useRouter();

  const isListingSaved = useMemo(() => {
    if (listingData.savedBy.find((el) => el === user?._id)) return true;
    return false;
  }, [listingData, user]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + totalImages) % totalImages
    );
  };

  const handleButtons = () => {
    setShowButtons(true);
  };

  const handleHideButtons = () => {
    setShowButtons(false);
  };

  const handleOpenDetails = () => {
    router.push(`/listings/${listingData._id}`);
  };

  const handleLikeListing = async () => {
    try {
      // send request to mark listing, figure out how to refresh listing data with tanstack query
      await listingAPI.save(listingData._id);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteListing = async () => {
    try {
      // send request to mark listing, figure out how to refresh listing data with tanstack query
      await listingAPI.delete(listingData._id);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.imageBox}
        onMouseEnter={handleButtons}
        onMouseLeave={handleHideButtons}
      >
        {showButtons && (
          <div
            className={`${styles.absoluteButton} ${styles.buttonLeft}`}
            onClick={handlePreviousImage}
          >
            <LeftChevron />
          </div>
        )}
        {showButtons && (
          <div
            className={`${styles.absoluteButton} ${styles.buttonRight}`}
            onClick={handleNextImage}
          >
            <RightChevron />
          </div>
        )}
        <img src={images[currentImageIndex].url} alt="No image" />
      </div>
      {/*  */}
      <div className={styles.infoBox}>
        <p className={styles.infoTitle}>Description</p>
        <p className={styles.infoData}>{listingData.description}</p>
        {/*  */}
        <p className={styles.infoTitle}>Model</p>
        <p className={styles.infoData}>{listingData.model}</p>
        {/*  */}
        <p className={styles.infoTitle}>Manufacturer</p>
        <p className={styles.infoData}>{listingData.manufacturer}</p>
        {/*  */}
        <p className={styles.infoTitle}>Price</p>
        <p className={styles.infoData}>{listingData.price}</p>
        {/*  */}
        <p className={styles.infoTitle}>Mileage</p>
        <p className={styles.infoData}>{listingData.mileage}</p>
        {/*  */}
        <p className={styles.infoTitle}>Year of Production</p>
        <p className={styles.infoData}>{listingData.yearOfProduction}</p>
        {/*  */}
        <p className={styles.infoTitle}>First year of registration</p>
        <p className={styles.infoData}>{listingData.firstYearOfRegistration}</p>
        {/*  */}
        <p className={styles.infoTitle}>Views</p>
        <p className={styles.infoData}>{listingData.views}</p>
      </div>
      {/*  */}
      <div className={styles.controlBox}>
        <div className={styles.iconButton} onClick={handleOpenDetails}>
          <OpenDetailsIcon size="24px" />
        </div>
        {!isListingSaved && (
          <div className={styles.iconButton} onClick={handleLikeListing}>
            <HeartIcon size="24px" />
          </div>
        )}
        {isListingSaved && (
          <div className={styles.iconButton} onClick={handleLikeListing}>
            <RedHeartIcon size="24px" />
          </div>
        )}
        <div className={styles.iconButton} onClick={handleDeleteListing}>
          <DeleteIcon size="24px" />
        </div>
      </div>
      {/*  */}
    </div>
  );
}
