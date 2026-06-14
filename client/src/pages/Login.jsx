import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await API.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="bg-white/80 backdrop-blur-md border border-green-100 p-10 rounded-3xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl">🌾</span>
          <h1 className="text-4xl font-bold mt-4 text-green-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Connect to your agriculture marketplace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-green-700/20 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:bg-green-400"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          New here?{" "}
          <Link to="/register" className="text-green-700 hover:underline font-semibold">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}