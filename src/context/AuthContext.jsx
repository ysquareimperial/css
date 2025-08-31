// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: "admin" | "reviewer" | "author" }

  const navigate = useNavigate();

  const login = (role) => {
    const fakeUser = { role };
    setUser(fakeUser);

    // redirect user based on role
    if (role === "admin") navigate("/dashboard/admin");
    if (role === "reviewer") navigate("/dashboard/reviewer");
    if (role === "author") navigate("/dashboard/author");
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
