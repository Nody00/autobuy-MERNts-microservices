import axios from "axios";

interface signUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
}

interface signInPayload {
  email: string;
  password: string;
}

interface updateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  recoveryPhoneNumber?: string;
}

export const authAPI = Object.freeze({
  signUp: async (payload: signUpPayload) => {
    const { data } = await axios.post("/auth/users/sign-up", payload);
    return data;
  },
  signIn: async (payload: signInPayload) => {
    const { data } = await axios.post("/auth/users/sign-in", payload);
    return data;
  },
  signOut: async () => {
    const { data } = await axios.post("/auth/sign-out");
    return data;
  },
  refreshToken: async () => {
    const { data } = await axios.post("/auth/refresh-token");
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await axios.delete(`/auth/users/delete-user/${id}`);
    return data;
  },
  updateUser: async (id: string, payload: updateUserPayload) => {
    const { data } = await axios.patch(`/auth/users/${id}`, payload);
    return data;
  },
});
