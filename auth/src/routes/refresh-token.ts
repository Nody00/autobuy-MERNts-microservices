import express from "express";
import { refreshTokenController } from "../controllers/refresh-token";
const router = express.Router();

router.post("/refresh-token", refreshTokenController);

export { router as refreshTokenRouter };
