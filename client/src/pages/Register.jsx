import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/api/auth/register", formData);
      alert("Registration Successful 🌾. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="bg-white/80 backdrop-blur-md border border-green-100 p-10 rounded-3xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl">🌱</span>
          <h1 className="text-4xl font-bold mt-4 text-green-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join the direct farm-to-table marketplace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Role</label>
            <select
              name="role"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="customer">Customer (Buyer)</option>
              <option value="farmer">Farmer (Seller)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-green-700/20 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:bg-green-400 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already registered?{" "}
          <Link to="/login" className="text-green-700 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}