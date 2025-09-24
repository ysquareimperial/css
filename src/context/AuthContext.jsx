// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for initial auth check
  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("access_token");

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          ...userData,
          access_token: savedToken,
        });
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Store user data and token
    setUser(userData);

    // Persist to localStorage (don't store sensitive token in user object for display)
    const userForStorage = {
      email: userData.email,
      role: userData.role,
    };

    localStorage.setItem("user", JSON.stringify(userForStorage));
    localStorage.setItem("access_token", userData.access_token);

    // Redirect user based on role
    if (userData.role === "admin") navigate("/dashboard/admin");
    else if (userData.role === "reviewer") navigate("/dashboard/reviewer");
    else if (userData.role === "author") navigate("/dashboard/author");
    else navigate("/dashboard"); // fallback
  };

  const logout = () => {
    setUser(null);
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // Helper function to get the current token
  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // Helper function to make authenticated API requests
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      logout(); // Token not found, logout user
      throw new Error("No authentication token found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // If token is invalid/expired, logout user
      if (response.status === 401) {
        logout();
        throw new Error("Authentication failed");
      }

      return response;
    } catch (error) {
      if (error.message === "Authentication failed") {
        logout();
      }
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    getToken,
    makeAuthenticatedRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
