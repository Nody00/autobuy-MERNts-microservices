// routes/user.routes.ts
import express from "express";
import { query } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
import { getAllUsersController } from "../controllers/get-users";

const router = express.Router();

router.get(
  "/users",
  authMiddleware,
  permissionMiddleware("read", "users"),
  [
    query("email").optional().isString().trim().isEmail(),
    query("firstName").optional().isString().trim(),
    query("lastName").optional().isString().trim(),
    query("phoneNumber").optional().isString().trim(),
    query("emailVerified").optional().isBoolean(),
    query("phoneVerified").optional().isBoolean(),
    query("isAdmin").optional().isBoolean(),
    query("isCustomer").optional().isBoolean(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("sortBy")
      .optional()
      .isString()
      .trim()
      .isIn(["email", "firstName", "lastName", "createdAt"]),
    query("sortOrder").optional().isString().trim().isIn(["asc", "desc"]),
  ],
  getAllUsersController
);

export { router as getUsersRouter };
