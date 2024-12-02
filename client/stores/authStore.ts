import { create } from "zustand";

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

interface AuthState {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isAdmin: boolean;
    isCustomer: boolean;
    permissions: [
      action: {
        type: String;
        enum: Action;
        required: true;
      },
      resource: {
        type: String;
        enum: Resource;
        required: true;
      }
    ];
  } | null;
  setUser: (payload: userData) => void;
}

interface userData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  isCustomer: boolean;
  permissions: [
    action: {
      type: String;
      enum: Action;
      required: true;
    },
    resource: {
      type: String;
      enum: Resource;
      required: true;
    }
  ];
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (userData: userData) => set((state) => ({ user: userData })),
}));
