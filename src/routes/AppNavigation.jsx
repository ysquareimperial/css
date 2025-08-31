// routes/AppNavigation.jsx
import { useRoutes } from "react-router-dom";
import AppIndex from "./AppIndex";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/Dashboards/AdminDashboard";
import ReviewerDashboard from "../pages/Dashboards/ReviewerDashboard";
import AuthorDashboard from "../pages/Dashboards/AuthorDashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppNavigation() {
  let element = useRoutes([
    {
      element: <AppIndex />,
      children: [
        { path: "/", element: <Login /> },
        {
          path: "/dashboard/admin",
          element: (
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/reviewer",
          element: (
            <ProtectedRoute role="reviewer">
              <ReviewerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/author",
          element: (
            <ProtectedRoute role="author">
              <AuthorDashboard />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: "/register", element: <Register /> },
  ]);
  return element;
}
export default AppNavigation;
