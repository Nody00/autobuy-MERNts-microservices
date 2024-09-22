import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/users/sign-un", (req: Request, res: Response) => {
  res.send({ message: "Sign up route" });
});

export { router as signUpRoute };
