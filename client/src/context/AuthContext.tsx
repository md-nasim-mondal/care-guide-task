import { useState, useEffect, type ReactNode } from "react";
import api from "../api/api";
import { toast, Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import {
  AuthContext,
  type User,
  type LoginData,
  type RegisterData,
} from "./AuthContextRef";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      await api.post("/auth/login", data);
      await fetchUser();
      toast.success("Logged in successfully");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post("/user/register", data);
      toast.success("Registered successfully. Please login.");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      <Toaster position='top-right' />
      {children}
    </AuthContext.Provider>
  );
};
