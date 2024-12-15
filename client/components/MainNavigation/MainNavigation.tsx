import { CarSideIcon } from "@/icons/CarSideIcon";
import styles from "./MainNavigation.module.css";
import { SettingsIcon } from "@/icons/SettingsIcon";
import Link from "next/link";
import { HeartIcon } from "@/icons/HeartIcon";
import { PlusCircleIcon } from "@/icons/PlusCircleIcon";
import { UserIcon } from "@/icons/UserIcon";
import { UsersIcon } from "@/icons/UsersIcon";
export const MainNavigation = () => {
  return (
    <div className={styles.container}>
      <Link
        href={"/new-listing"}
        className={styles.linkButton}
        title="New Listing"
      >
        <PlusCircleIcon size="24px" />
      </Link>

      <Link href={"/listings"} className={styles.linkButton} title="Listings">
        <CarSideIcon size="24px" />
      </Link>

      <Link
        href={"/saved"}
        className={styles.linkButton}
        title="Saved Listings"
      >
        <HeartIcon size="24px" />
      </Link>

      <Link
        href={"/my-profile"}
        className={styles.linkButton}
        title="My Profile"
      >
        <UserIcon size="24px" />
      </Link>

      <Link href={"/users"} className={styles.linkButton} title="Manage Users">
        <UsersIcon size="24px" />
      </Link>

      <Link href={"/settings"} className={styles.linkButton} title="Settings">
        <SettingsIcon size="24px" />
      </Link>
    </div>
  );
};
