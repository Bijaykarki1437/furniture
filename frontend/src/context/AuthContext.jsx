// context/AuthContext.jsx
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
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("✅ User loaded from /me:", data);
      
      // Store user in localStorage
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

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Listen for storage changes (for cross-tab sync and manual updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue);
            setUser(userData);
          } catch (err) {
            console.error('Error parsing user data:', err);
          }
        } else {
          setUser(null);
        }
      }
      
      if (e.key === 'token' && !e.newValue) {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, verified: true })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      console.log("✅ Signup response:", data);

      // 🔥 Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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

      console.log("✅ Login response:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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
    localStorage.removeItem("user");
    setUser(null);
    setShowAuthModal(false);
  };

  // Force refresh user data
  const refreshUser = async () => {
    await loadUser();
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
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};