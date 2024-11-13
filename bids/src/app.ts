import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

const BASE_ROUTE = "/bids";
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

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
