import express from "express";
import { json } from "body-parser";
import { createListingRouter } from "./routes/create-listing";
const BASE_ROUTE = "/listings";
const app = express();

app.set("trust proxy", true);
app.use(json());

app.use(BASE_ROUTE, createListingRouter);

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
