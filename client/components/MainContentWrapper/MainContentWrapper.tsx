import styles from "./MainContentWrapper.module.css";
import { ListingsFilter } from "../ListingsFilter/ListingsFilter";
import { ReactNode } from "react";
export const MainContentWrapper = ({ children }: { children: ReactNode }) => {
  return <div className={styles.container}>{children}</div>;
};
