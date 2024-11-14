import { Request, Response, NextFunction } from "express";

export interface Permission {
  action: "create" | "read" | "update" | "delete" | "manage";
  resource: "listings" | "bids" | "users" | "logs" | "notifications";
  _id: string;
}

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}

interface permissionsRequest extends Request {
  user?: UserPayload;
}

export const permissionMiddleware = (
  action: Permission["action"],
  resource: Permission["resource"]
) => {
  return (req: permissionsRequest, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).send({ message: "Not authenticated" });
    }

    const hasPermission = req.user.permissions.some(
      (permission) =>
        permission.action === action ||
        (permission.action === "manage" && permission.resource === resource)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Insufficient permissions!",
      });
    }

    next();
  };
};
