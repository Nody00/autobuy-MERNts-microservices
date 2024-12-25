import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { getAuthTokens } from "@/config/axiosConfig";
import styles from "./mainPage.module.css";
import axios from "axios";

const LandingPage = () => {
  return <div className={styles.container}></div>;
};

export default LandingPage;
