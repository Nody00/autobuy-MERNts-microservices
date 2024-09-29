import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { getListingsRoute } from "./routes/getListings";
import { createListingsRoute } from "./routes/createListing";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use("/listings", getListingsRoute);
app.use("/listings", createListingsRoute);

app.all("*", async (req, res) => {
  res.send({ message: "Route not found" });
});

export { app };
