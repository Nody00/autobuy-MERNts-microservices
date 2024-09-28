import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/new/user", (req: Request, res: Response) => {
  console.log("dinov log req.body", req.body.newUser);
  res.status(200).json(req.body.newUser);
});

export { router as newUserRouter };
