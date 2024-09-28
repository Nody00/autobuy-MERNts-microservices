import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { signInRoute } from "./routes/signIn";
import { signUpRoute } from "./routes/signUp";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use("/auth", signInRoute);
app.use("/auth", signUpRoute);

app.all("*", async (req, res) => {
  res.send({ message: "Route not found" });
});

export { app };
