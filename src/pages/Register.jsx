import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Spinner component
const Spinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
    <span className="sr-only">Loading...</span>
  </div>
);

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // modal state
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://yaji.onrender.com/api/users/create_user/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowModal(true); // show modal on success
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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
        <h2 className="text-xl font-semibold mb-6 text-gray-600">Register</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
        >
          <option value="">Select role</option>
          <option value="author">Author</option>
          <option value="reviewer">Reviewer</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <Spinner />}
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-5 text-center">
          Already have an account?{" "}
          <span
            className={`text-blue-500 cursor-pointer transition-colors ${
              loading 
                ? 'pointer-events-none opacity-50' 
                : 'hover:underline hover:text-blue-600'
            }`}
            onClick={() => !loading && navigate("/")}
          >
            Login here
          </span>
        </p>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-xl font-bold text-green-600 mb-3">
              Registration Successful 🎉
            </h2>
            <p className="text-gray-700 mb-5">
              Your account has been created successfully.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/login"); // go to login
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}