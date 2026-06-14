import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

const CATEGORIES = ["Vegetables", "Fruits", "Grains", "Seeds", "Fertilizers", "Dairy"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "Vegetables",
    inventory: "100",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!token || (user && user.role !== "farmer" && user.role !== "admin")) {
      alert("Access Denied. Only farmers can add products. 👨‍🌾");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.image) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/api/products", product);
      alert("Product Added Successfully to Marketplace! 🌾");
      navigate("/farmer");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-8 md:p-10">
            <h1 className="text-3xl font-extrabold text-green-800 mb-2 text-center">
              List New Produce 🌱
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Post fresh items directly to the digital buyer catalog
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Organic Red Tomatoes"
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Category *</label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300 font-semibold text-gray-700"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Price (₹ per kg/unit) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={product.price}
                    onChange={handleChange}
                    placeholder="e.g. 40"
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Inventory Stock (kg/units) *</label>
                  <input
                    type="number"
                    name="inventory"
                    required
                    value={product.inventory}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Product Image URL *</label>
                <input
                  type="text"
                  name="image"
                  required
                  value={product.image}
                  onChange={handleChange}
                  placeholder="Paste Unsplash or direct image link..."
                  className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                />
                {product.image && (
                  <div className="mt-4 border border-gray-100 rounded-2xl overflow-hidden h-40 bg-gray-50 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Product Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Describe your harvesting process, organic status, freshness guarantees..."
                  rows="4"
                  className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-green-700/10 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:bg-green-400"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Submit Listing 🌱"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}