import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Spinner component
const Spinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
    <span className="sr-only">Loading...</span>
  </div>
);

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create form data as required by the API
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("username", email); // API uses 'username' for email
      formData.append("password", password);

      const response = await fetch(
        "https://yaji.onrender.com/api/users/login_user",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Login successful - pass the full user data to login function
        login({
          email: data.email,
          role: data.role,
          access_token: data.access_token,
          token_type: data.token_type,
        });
      } else {
        // Handle login error
        setError(data.detail || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <Spinner />}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center">
          Don't have an account?{" "}
          <span
            className={`text-blue-500 cursor-pointer transition-colors ${
              loading
                ? "pointer-events-none opacity-50"
                : "hover:underline hover:text-blue-600"
            }`}
            onClick={() => !loading && navigate("/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
