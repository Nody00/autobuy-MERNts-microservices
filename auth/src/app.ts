import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { signInRoute } from "./routes/sign-in";
import { signUpRoute } from "./routes/sign-up";
const BASE_ROUTE = "/auth";
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

app.use(BASE_ROUTE, signInRoute);
app.use(BASE_ROUTE, signUpRoute);

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
