import express from "express";
import { signOutController } from "../controllers/sign-out";

const router = express.Router();

router.post("/sign-out", signOutController);
