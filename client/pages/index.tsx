import React, { useEffect } from "react";
import axios from "axios";
import { authAPI } from "@/api/auth";
const LandingPage = () => {
  const fetchListings = async () => {
    try {
      const payload = {
        email: "dinotest@mail.com",
        password: "password123",
      };
      const data = await authAPI.signIn(payload);

      setTimeout(async () => {
        const data = await axios.get("query/listing");
        console.log("dinov log data", data);
      }, 10000);
      console.log("dinov log data", data);
    } catch (error) {
      console.error("dinov log error", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);
  return <div>landing page test</div>;
};

export default LandingPage;
