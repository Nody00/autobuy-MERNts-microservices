import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/users/sign-in", (req: Request, res: Response) => {
  res.send({ message: "Sign in route" });
});

export { router as signInRoute };
