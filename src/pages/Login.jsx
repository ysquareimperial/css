import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // fake authentication mapping
    if (email === "admin@test.com" && password === "admin123") {
      login("admin"); // will set user.role = "admin" and redirect
    } else if (email === "reviewer@test.com" && password === "reviewer123") {
      login("reviewer");
    } else if (email === "author@test.com" && password === "author123") {
      login("author");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Conference Submission System
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-600">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        <p className="mt-5">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
