import React, { ReactNode } from "react";

import styles from "./Layout.module.css";
import { MainNavigation } from "../MainNavigation/MainNavigation";
import { TopSearchBar } from "../TopSearchBar/TopSearchBar";
import { MainContentWrapper } from "../MainContentWrapper/MainContentWrapper";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <MainNavigation />
      <TopSearchBar />
      <MainContentWrapper>{children}</MainContentWrapper>
      {/* regular users should be able to only see the listings while the admins can see the dashboard for data reporting */}
    </div>
  );
}
