import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  
  // Dashboard data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Product Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    inventory: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || (storedUser && JSON.parse(storedUser).role !== "farmer" && JSON.parse(storedUser).role !== "admin")) {
      alert("Access Denied. Only farmers can view this dashboard.");
      navigate("/");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchDashboardData(JSON.parse(storedUser));
  }, [navigate]);

  const fetchDashboardData = async (currentUser) => {
    setLoading(true);
    try {
      // 1. Fetch farmer's products
      const productsRes = await API.get(`/api/products?farmer=${currentUser._id}`);
      setProducts(productsRes.data.products || []);

      // 2. Fetch orders containing this farmer's products
      const ordersRes = await API.get("/api/orders");
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await API.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  // Edit product modal trigger
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      price: p.price,
      inventory: p.inventory,
      description: p.description,
      category: p.category,
    });
  };

  // Submit product edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/api/products/${editingProduct._id}`, editForm);
      setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
      setEditingProduct(null);
      alert("Product updated successfully! 🌾");
    } catch (err) {
      console.error(err);
      alert("Failed to update product details.");
    }
  };

  // Update order tracking status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await API.patch(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      alert(`Order status updated to: ${status} 📦`);
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  // Calculate dynamic stats
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;

  // Earnings are calculated only for items belonging to THIS farmer
  const totalEarnings = orders.reduce((sum, order) => {
    const farmerItems = order.items.filter((item) => item.farmerId === user?._id);
    const orderCost = farmerItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return sum + orderCost;
  }, 0);

  // Chart data calculations (monthly sales)
  const getMonthlySales = () => {
    const monthlySales = Array(6).fill(0);
    const monthsName = [];
    const date = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      monthsName.push(d.toLocaleString("default", { month: "short" }));
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const diffMonths = (date.getFullYear() - orderDate.getFullYear()) * 12 + (date.getMonth() - orderDate.getMonth());
      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;
        const farmerItems = order.items.filter((item) => item.farmerId === user?._id);
        const amount = farmerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        monthlySales[index] += amount;
      }
    });

    return { monthlySales, monthsName };
  };

  const { monthlySales, monthsName } = getMonthlySales();

  // SVG Chart rendering helper
  const renderSVGChart = () => {
    const maxVal = Math.max(...monthlySales, 1000);
    const padding = 40;
    const height = 200;
    const width = 500;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    const points = monthlySales
      .map((val, idx) => {
        const x = padding + (idx * chartWidth) / 5;
        const y = height - padding - (val / maxVal) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Performance (Last 6 Months)</h3>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
              const y = padding + p * chartHeight;
              return (
                <g key={idx}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                  <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-semibold">
                    ₹{Math.round(maxVal * (1 - p))}
                  </text>
                </g>
              );
            })}

            {/* Path */}
            <polyline fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />

            {/* Dots & Labels */}
            {monthlySales.map((val, idx) => {
              const x = padding + (idx * chartWidth) / 5;
              const y = height - padding - (val / maxVal) * chartHeight;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" className="fill-green-700 stroke-white stroke-2" />
                  <text x={x} y={height - 10} textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">
                    {monthsName[idx]}
                  </text>
                  {val > 0 && (
                    <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] fill-green-800 font-bold">
                      ₹{val}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-gray-500 font-medium">Loading farmer dashboard console...</span>
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
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-green-800">Farmer Dashboard 🌾</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Manage your store operations here.</p>
            </div>

            <div className="flex bg-white rounded-2xl p-1 border border-gray-200/60 shadow-sm">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeTab === "overview" ? "bg-green-700 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeTab === "products" ? "bg-green-700 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeTab === "orders" ? "bg-green-700 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Incoming Orders
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metrics grid */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-green-700 text-white p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="z-10">
                    <span className="text-sm font-bold uppercase tracking-wider text-green-200">Total Listings</span>
                    <p className="text-5xl font-black mt-3">{totalProductsCount}</p>
                  </div>
                  <span className="absolute right-4 bottom-2 text-7xl opacity-10">🌱</span>
                </div>

                <div className="bg-yellow-500 text-white p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="z-10">
                    <span className="text-sm font-bold uppercase tracking-wider text-yellow-100">Store Orders</span>
                    <p className="text-5xl font-black mt-3">{totalOrdersCount}</p>
                  </div>
                  <span className="absolute right-4 bottom-2 text-7xl opacity-10">📦</span>
                </div>

                <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="z-10">
                    <span className="text-sm font-bold uppercase tracking-wider text-emerald-200">Total Sales</span>
                    <p className="text-5xl font-black mt-3">₹{totalEarnings}</p>
                  </div>
                  <span className="absolute right-4 bottom-2 text-7xl opacity-10">💰</span>
                </div>
              </div>

              {/* Monthly sales chart */}
              {renderSVGChart()}
            </div>
          )}

          {/* TAB 2: MANAGE PRODUCTS */}
          {activeTab === "products" && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Manage Listed Products</h3>
                <button
                  onClick={() => navigate("/add-product")}
                  className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition active:scale-95"
                >
                  + Add New Product
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  You haven't listed any products yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="py-4">Product Info</th>
                        <th className="py-4">Category</th>
                        <th className="py-4">Price</th>
                        <th className="py-4">Stock</th>
                        <th className="py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td className="py-4 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                            <span className="font-bold text-gray-900">{p.name}</span>
                          </td>
                          <td className="py-4 text-gray-500">{p.category}</td>
                          <td className="py-4 text-green-700 font-bold">₹{p.price}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.inventory < 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                            }`}>
                              {p.inventory} units
                            </span>
                          </td>
                          <td className="py-4 text-center space-x-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK INCOMING ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Store Purchase Requests</h3>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No purchase orders found for your products.
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const myItems = order.items.filter((item) => item.farmerId === user?._id);
                    const myTotal = myItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

                    return (
                      <div key={order._id} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-gray-200 transition">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-gray-900">Order ID: {order._id.substring(18)}</span>
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
                            <p className="text-xs text-gray-400 mt-1">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-gray-400 uppercase">Change Status:</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              className="border border-gray-200 p-2 rounded-xl outline-none bg-white text-xs font-bold focus:border-green-600"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Items & Customer Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Ordered Items</h4>
                            <div className="space-y-2">
                              {myItems.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm text-gray-700 font-semibold">
                                  <span>{item.name} x {item.quantity}</span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between text-base font-extrabold text-green-800">
                              <span>My Revenue</span>
                              <span>₹{myTotal}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Delivery Details</h4>
                            <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-600 mt-1">📞 {order.phoneNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {order.address}</p>
                            <p className="text-xs text-gray-400 mt-1">💳 {order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EDIT PRODUCT MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Edit Product 🌱</h3>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:border-green-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:border-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Stock Stock</label>
                      <input
                        type="number"
                        required
                        value={editForm.inventory}
                        onChange={(e) => setEditForm({ ...editForm, inventory: e.target.value })}
                        className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:border-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows="3"
                      className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:border-green-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl shadow mt-4 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}