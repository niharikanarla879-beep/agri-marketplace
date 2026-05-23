import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      console.log(error);
      console.log(error.response);
      alert(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Registration failed"

      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-[400px]"
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-green-700">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="farmer">Farmer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
}