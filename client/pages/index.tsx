import React, { useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
  const fetchListings = async () => {
    try {
      const { data } = await axios.get("https://autobuy.dev/listings/get");

      console.log("dinov log data", data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchListings();
  }, []);
  return <div>landing page</div>;
};

export default LandingPage;
