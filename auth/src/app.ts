import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { signInRoute } from "./routes/signIn";
import { signUpRoute } from "./routes/signUp";
const BASE_ROUTE = "/auth";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(BASE_ROUTE, signInRoute);
app.use(BASE_ROUTE, signUpRoute);

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
