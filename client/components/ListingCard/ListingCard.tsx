import { ListingType } from "@/types/listingType";
import styles from "./ListingCard.module.css";
import { useState } from "react";
import { LeftChevron } from "@/icons/LeftChevron";
import { RightChevron } from "@/icons/RightChevron";

export default function ListingCard({
  listingData,
}: {
  listingData: ListingType;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const images = listingData.images || [];
  const totalImages = images.length;
  console.log("dinov log listingData", listingData);

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
    // setTimeout(() => {
    setShowButtons(false);
    // }, 1000);
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
      <div className={styles.controlBox}></div>
      {/*  */}
    </div>
  );
}
