import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { getListingRouter } from "./routes/get-listing";

const BASE_ROUTE = "/query";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(BASE_ROUTE, getListingRouter);

app.all("*", async (req, res) => {
  throw new Error("Route not found!");
});

export { app };
