import React, { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

import styles from "./Layout.module.css";
import { MainNavigation } from "../MainNavigation/MainNavigation";
import { TopSearchBar } from "../TopSearchBar/TopSearchBar";
import { MainContentWrapper } from "../MainContentWrapper/MainContentWrapper";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <MainNavigation />
      <TopSearchBar />
      <MainContentWrapper>{children}</MainContentWrapper>
      {/* regular users should be able to only see the listings while the admins can see the dashboard for data reporting */}
    </div>
  );
}
