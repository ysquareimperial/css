import { useAuth } from "../../context/AuthContext";

export default function ReviewerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reviewer Dashboard</h1>
      <p className="mt-2">Welcome, {user?.email}!</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
