import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

interface requestInterface {
  type: "newListing" | "newUser";
  data: {};
}

const router = express.Router();

router.post(
  "/new/event",
  [body("data").isObject().exists(), body("type").isString().exists()],
  (req: Request<{}, {}, requestInterface>, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(`Event type:${req.body.type}, event data:`, req.body.data);

    res.send({ type: req.body.type, data: req.body.data });
  }
);

export { router as newEventRouter };
