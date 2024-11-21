import React, { useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
  const fetchListings = async () => {
    try {
      const { data } = await axios.get("https://autobuy.dev/listings/get");
    } catch (error) {}
  };

  useEffect(() => {
    fetchListings();
  }, []);
  return <div>landing page test</div>;
};

export default LandingPage;
