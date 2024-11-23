export interface newUserEvent {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  recoveryPhoneNumber: string;
  recoveryEmail: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  saves: [];
  deleted: boolean;
  version: number;
  isAdmin: boolean;
  isCustomer: boolean;
  role: {};
  operation: "create" | "delete" | "update";
  _id: string;
}
