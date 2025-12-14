import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("rb_user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("rb_token") || "");
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("rb_user", JSON.stringify(data.user));
      localStorage.setItem("rb_token", data.token);
      return { ok: true, user: data.user };
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/register", payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("rb_user", JSON.stringify(data.user));
      localStorage.setItem("rb_token", data.token);
      return { ok: true, user: data.user };
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("rb_user");
    localStorage.removeItem("rb_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
