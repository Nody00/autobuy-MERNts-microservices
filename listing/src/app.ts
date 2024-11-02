import express from "express";
import { json } from "body-parser";
import { createListingRouter } from "./routes/create-listing";
import { updateListingRouter } from "./routes/update-listing";
import { deleteListingRouter } from "./routes/delete-listing";

import cookieSession from "cookie-session";
const BASE_ROUTE = "/listings";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SESSION_KEY!], // Use a secure, randomly generated key
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    secure: false, // Secure cookies in production
    httpOnly: true, // Prevents client-side JS from accessing the cookies
  })
);

app.use(BASE_ROUTE, createListingRouter);
app.use(BASE_ROUTE, deleteListingRouter);
app.use(BASE_ROUTE, updateListingRouter);

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
