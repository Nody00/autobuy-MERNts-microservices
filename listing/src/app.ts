import express from "express";
import { json } from "body-parser";
import { createListingRouter } from "./routes/create-listing";
import { updateListingRouter } from "./routes/update-listing";
import { deleteListingRouter } from "./routes/delete-listing";
import { getListingRouter } from "./routes/get-listing";

const BASE_ROUTE = "/listings";
const app = express();

app.set("trust proxy", true);
app.use(json());

app.use(BASE_ROUTE, createListingRouter);
app.use(BASE_ROUTE, deleteListingRouter);
app.use(BASE_ROUTE, updateListingRouter);
app.use(BASE_ROUTE, getListingRouter);

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
