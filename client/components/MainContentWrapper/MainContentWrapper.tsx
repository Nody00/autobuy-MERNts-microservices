import styles from "./MainContentWrapper.module.css";
import { ListingsFilter } from "../ListingsFilter/ListingsFilter";
export const MainContentWrapper = () => {
  return (
    <div className={styles.container}>
      <ListingsFilter />
    </div>
  );
};
