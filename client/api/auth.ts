import axios from "axios";

interface signUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: string;
}

interface signInPayload {
  email: string;
  password: string;
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
});
