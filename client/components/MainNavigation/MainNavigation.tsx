import { CarSideIcon } from "@/icons/CarSideIcon";
import styles from "./MainNavigation.module.css";
import { SettingsIcon } from "@/icons/SettingsIcon";
import Link from "next/link";
import { HeartIcon } from "@/icons/HeartIcon";
import { PlusCircleIcon } from "@/icons/PlusCircleIcon";
import { UserIcon } from "@/icons/UserIcon";
import { UsersIcon } from "@/icons/UsersIcon";
import { usePathname } from "next/navigation";
export const MainNavigation = () => {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <Link
        href={"/new-listing"}
        className={`${styles.linkButton} ${
          pathname === "/new-listing" ? styles.activeButton : ""
        }`}
        title="New Listing"
      >
        <PlusCircleIcon size="24px" />
      </Link>

      <Link
        href={"/listings"}
        className={`${styles.linkButton} ${
          pathname === "/listings" ? styles.activeButton : ""
        }`}
        title="Listings"
      >
        <CarSideIcon size="24px" />
      </Link>

      <Link
        href={"/saved"}
        className={`${styles.linkButton} ${
          pathname === "/saved" ? styles.activeButton : ""
        }`}
        title="Saved Listings"
      >
        <HeartIcon size="24px" />
      </Link>

      <Link
        href={"/my-profile"}
        className={`${styles.linkButton} ${
          pathname === "/my-profile" ? styles.activeButton : ""
        }`}
        title="My Profile"
      >
        <UserIcon size="24px" />
      </Link>

      <Link
        href={"/users"}
        className={`${styles.linkButton} ${
          pathname === "/users" ? styles.activeButton : ""
        }`}
        title="Manage Users"
      >
        <UsersIcon size="24px" />
      </Link>

      <Link
        href={"/settings"}
        className={`${styles.linkButton} ${
          pathname === "/settings" ? styles.activeButton : ""
        }`}
        title="Settings"
      >
        <SettingsIcon size="24px" />
      </Link>
    </div>
  );
};
