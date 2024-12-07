import React, { useEffect } from "react";
import axios from "axios";
import { authAPI } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
const LandingPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <div>MAIN PAGE</div>;
};

export default LandingPage;
