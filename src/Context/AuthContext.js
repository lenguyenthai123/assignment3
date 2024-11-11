// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("accessToken") || null);

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/auth/info`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setToken(null);
          setUser(null);
          Cookies.remove("accessToken");
        });
    }
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    Cookies.set("accessToken", token, { expires: 7 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
