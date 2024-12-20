import { UserIcon } from "@/icons/UserIcon";
import styles from "./TopSearchBar.module.css";
import { useAuthStore } from "@/stores/authStore";
import SearchIcon from "@/icons/SearchIcon";

export const TopSearchBar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className={styles.container}>
      <div className={styles.searchInput}>
        <SearchIcon />
        <input type="text" />
      </div>

      {/*  */}
      <div className={styles.iconAndMailBox}>
        <UserIcon size="16px" />
        <p>{user?.email || ""}</p>
      </div>
    </div>
  );
};
