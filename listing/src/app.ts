import express from "express";
import { json } from "body-parser";

const BASE_ROUTE = "/listing";
const app = express();

app.set("trust proxy", true);
app.use(json());

app.all("*", async (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

export { app };
