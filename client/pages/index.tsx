import React, { useEffect } from "react";
import axios from "axios";
import { authAPI } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
const LandingPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  console.log("dinov log user", user);
  const fetchListings = async () => {
    try {
      const payload = {
        email: "dinotest@mail.com",
        password: "password123",
      };
      const data = await authAPI.signIn(payload);

      setUser(data.user);
    } catch (error) {
      console.error("dinov log error", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSubmit = (e: any) => {
    console.log("dinov log e", e);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email"></input>
        <input type="password" name="password"></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default LandingPage;
