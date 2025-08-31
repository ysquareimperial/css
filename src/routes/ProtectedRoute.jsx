// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />; // redirect to login
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // block wrong role
  }

  return children;
};

export default ProtectedRoute;
