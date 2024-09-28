import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { newUserRouter } from "./routes/newUser";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use("/event-bus", newUserRouter);

app.all("*", async (req, res) => {
  res.send({ message: "Route not found" });
});

export { app };
