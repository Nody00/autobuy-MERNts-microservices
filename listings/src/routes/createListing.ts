import { Router, Request, Response } from "express";
import axios from "axios";
const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  const newListing = {
    model: req.body.model,
    year: req.body.year,
  };

  console.log("dinov log newListing", newListing);

  const result = await axios.post(
    "http://event-bus-srv:5000/event-bus/new/event",
    {
      type: "newListing",
      data: newListing,
    }
  );

  console.log("dinov log result", result);

  res.status(200).json(result.data);
});

export { router as createListingsRoute };
