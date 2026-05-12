import { create } from "zustand";
import { login as loginAction } from "../actions/login.action";
import { checkStatus } from "../actions/check-status.action";
import type { AuthUser } from "@/shop/interfaces/authResponse";

export type AuthStatus = "authenticated" | "not-authenticated" | "pending";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  authStatus: AuthStatus;

  isAdmin: () => boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  authStatus: "pending",

  isAdmin: () => {
    const { user } = get();
    return user?.role === "ADMIN";
  },

  login: async (email: string, password: string) => {
    try {
      const response = await loginAction(email, password);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        authStatus: "authenticated",
      });

      return true;
    } catch {
      set({
        user: null,
        token: null,
        authStatus: "not-authenticated",
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      authStatus: "not-authenticated",
    });
  },

  checkAuthStatus: async () => {
    try {
      console.log("checkAuthStatus")
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("no token")
        set({ 
          authStatus: "not-authenticated",
          user: null,
          token: null,
        });
        return false;
      }

      console.log("checkStatus")
      const response = await checkStatus();
      console.log({response})

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        authStatus: "authenticated",
      });

      return true;
    } catch (error) {
      console.log("catch", {error})
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        user: null,
        token: null,
        authStatus: "not-authenticated",
      });
      return false;
    }
  },
}));
