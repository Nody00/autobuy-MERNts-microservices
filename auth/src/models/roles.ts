import mongoose, { Schema, Document } from "mongoose";

// Definition of basic permission actions
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage", // Special permission that grants all actions
}

// Definition of app resources
export enum Resource {
  USERS = "users",
  LISTINGS = "listings",
  BIDS = "bids",
  LOGS = "logs",
  NOTIFICATIONS = "notifications",
}

interface Permission {
  action: Action;
  resource: Resource;
}

interface IRole extends Document {
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<Permission>({
  action: {
    type: String,
    enum: Object.values(Action),
    required: true,
  },
  resource: {
    type: String,
    enum: Object.values(Resource),
    required: true,
  },
});

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: [permissionSchema],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to check permissions
roleSchema.methods.hasPermission = function (
  action: Action,
  resource: Resource
): boolean {
  return this.permissions.some(
    (p: Permission) =>
      (p.action === action || p.action === Action.MANAGE) &&
      p.resource === resource
  );
};

// these will be initialized on app startup
export const defualtRoles = {
  ADMIN: {
    name: "Admin",
    description: "Full system access",
    permissions: [
      { action: Action.MANAGE, resource: Resource.USERS },
      { action: Action.MANAGE, resource: Resource.BIDS },
      { action: Action.MANAGE, resource: Resource.LISTINGS },
      { action: Action.MANAGE, resource: Resource.NOTIFICATIONS },
      { action: Action.MANAGE, resource: Resource.LOGS },
    ],
  },
  USER: {
    name: "User",
    description: "Regular user access",
    permissions: [
      { action: Action.CREATE, resource: Resource.LISTINGS },
      { action: Action.READ, resource: Resource.LISTINGS },
      { action: Action.UPDATE, resource: Resource.LISTINGS },
      { action: Action.DELETE, resource: Resource.LISTINGS },
      { action: Action.READ, resource: Resource.LISTINGS },
      { action: Action.CREATE, resource: Resource.BIDS },
      { action: Action.UPDATE, resource: Resource.BIDS },
      { action: Action.READ, resource: Resource.BIDS },
    ],
  },
};

export const Role = mongoose.model<IRole>("Role", roleSchema);

export type { IRole, Permission };
export { permissionSchema };
