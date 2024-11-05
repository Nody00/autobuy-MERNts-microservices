import { defualtRoles } from "../models/roles";
import { Role } from "../models/roles";
export const InitializeRoles = async () => {
  try {
    for (const [key, roleData] of Object.entries(defualtRoles)) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        { ...roleData, isDefault: true },
        { upsert: true, new: true }
      );
    }
    // console.log("Roles initialized successfully");
  } catch (error) {
    console.error("Error initializing roles:", error);
    throw error;
  }
};
