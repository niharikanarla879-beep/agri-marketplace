import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || (storedUser && JSON.parse(storedUser).role !== "admin")) {
      alert("Access Denied. Admin portal only.");
      navigate("/");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Get all products (unpaginated or limit 50 for admin)
      const res = await API.get("/api/products", { params: { limit: 50 } });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products for administration.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This will remove it from all buyer views.")) return;
    try {
      await API.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully from marketplace.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-gray-500 font-medium">Loading admin catalog console...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-red-600">Admin Control Panel 👨‍💼</h1>
            <p className="text-gray-500 mt-1">Global catalog listing management and moderation console.</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl text-gray-400">
              No products found in the database.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full object-cover rounded-2xl bg-gray-50"
                    />

                    <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-4">
                      {product.category}
                    </span>

                    <h2 className="text-xl font-bold mt-2 text-gray-900">{product.name}</h2>
                    <p className="text-gray-400 text-xs mt-1">ID: {product._id}</p>
                    
                    {product.farmer && (
                      <p className="text-gray-500 text-xs mt-2 font-medium">
                        🧑‍🌾 Seller: {product.farmer.name} ({product.farmer.email})
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-green-700 text-xl font-extrabold">₹{product.price}</span>
                      <span className="text-xs font-semibold text-gray-400">Stock: {product.inventory} units</span>
                    </div>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl hover:shadow hover:shadow-red-500/10 transition cursor-pointer"
                    >
                      Delete Catalog Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}