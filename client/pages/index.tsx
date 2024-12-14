import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

import styles from "./mainPage.module.css";

const LandingPage = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <div className={styles.container}></div>;
};

export default LandingPage;
