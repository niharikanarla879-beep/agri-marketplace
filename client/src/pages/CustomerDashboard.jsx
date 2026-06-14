import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !storedUser) {
      alert("Access Denied. Please login first to view your dashboard.");
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user orders
      const ordersRes = await API.get("/api/orders");
      setOrders(ordersRes.data || []);

      // 2. Fetch user profile for updated wishlist count
      const profileRes = await API.get("/api/auth/me");
      setWishlistCount(profileRes.data.wishlist?.length || 0);

      // 3. Get Cart item count
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCartCount = cart.reduce((acc, it) => acc + (it.quantity || 1), 0);
      setCartCount(totalCartCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate spent total
  const totalSpent = orders.reduce((sum, o) => {
    if (o.status !== "Cancelled") {
      return sum + o.totalPrice;
    }
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-gray-500 font-medium">Loading customer profile...</span>
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
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-green-800">My Dashboard 🛒</h1>
            <p className="text-gray-500 mt-1">Hello, {user?.name}. Monitor your orders and wishlist here.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-4 gap-6 mb-12">
            <div className="bg-green-700 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-200">Total Orders</span>
                <p className="text-4xl font-black mt-2">{orders.length}</p>
              </div>
              <span className="absolute right-4 bottom-2 text-5xl opacity-10">📦</span>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-100">Wishlisted</span>
                <p className="text-4xl font-black mt-2">{wishlistCount}</p>
              </div>
              <span className="absolute right-4 bottom-2 text-5xl opacity-10">❤️</span>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Cart Items</span>
                <p className="text-4xl font-black mt-2">{cartCount}</p>
              </div>
              <span className="absolute right-4 bottom-2 text-5xl opacity-10">🛒</span>
            </div>

            <div className="bg-emerald-800 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Total Spent</span>
                <p className="text-4xl font-black mt-2">₹{totalSpent}</p>
              </div>
              <span className="absolute right-4 bottom-2 text-5xl opacity-10">💰</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Order history list */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Recent Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="mb-4">You haven't placed any orders yet.</p>
                  <Link to="/products" className="text-green-700 font-bold hover:underline">
                    Browse and shop fresh produce now!
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 mb-4 gap-2">
                        <div>
                          <span className="font-extrabold text-gray-900 text-base">Order ID: {order._id.substring(18)}</span>
                          <span className="text-xs text-gray-400 font-medium ml-2">
                            ({new Date(order.createdAt).toLocaleDateString()})
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm font-semibold text-gray-700">
                            <span>{item.name} <span className="text-gray-400 font-normal">x {item.quantity}</span></span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
                        <div className="text-gray-500 font-medium">
                          📍 Delivery Address: <span className="text-gray-700 font-bold">{order.address}</span>
                        </div>
                        <div className="text-lg font-extrabold text-green-800">
                          Total: ₹{order.totalPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dashboard shortcuts */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Shortcuts</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    to="/products"
                    className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 hover:bg-green-50/50 hover:text-green-800 transition font-semibold text-gray-600 text-sm"
                  >
                    <span>🛍️ Shop Marketplace</span>
                    <span>→</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 hover:bg-green-50/50 hover:text-green-800 transition font-semibold text-gray-600 text-sm"
                  >
                    <span>❤️ View Saved Wishlist</span>
                    <span>→</span>
                  </Link>

                  <Link
                    to="/cart"
                    className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 hover:bg-green-50/50 hover:text-green-800 transition font-semibold text-gray-600 text-sm"
                  >
                    <span>🛒 Manage Shopping Cart</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}