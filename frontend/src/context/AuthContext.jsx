import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // 🔑 Get token
  const getToken = () => localStorage.getItem("token");

  // ✅ Load user (VALIDATE TOKEN)
// In AuthContext.jsx, update the loadUser function to also store user in localStorage
useEffect(() => {
  const loadUser = async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Clear stored user
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Loaded user data from /me:", data);
      console.log("User role from /me:", data.role);
      
      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(data));
      
      setUser(data);

    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false);
  };

  loadUser();
}, []); 

  // ✅ SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      console.log("Signup response:", data); // Debug log

      // 🔥 Store token and user data
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowAuthModal(false);

      return { success: true };

    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: err.message };
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      console.log("Login response:", data); // Debug log

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowAuthModal(false);

      return { success: true };

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err.message };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowAuthModal(false);
  };

  const value = {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};