import type { AppProps } from "next/app";
import "./globalStyles.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { useEffect } from "react";
import { getAuthTokens } from "@/config/axiosConfig";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { authAPI } from "@/api/auth";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function checkSession() {
      try {
        const result = await authAPI.refreshToken();
        if (result.user) {
          setUser(result.user);
          router.push("/listings");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    }
    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
