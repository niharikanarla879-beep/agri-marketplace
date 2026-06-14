import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "Cash On Delivery",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      alert("Please login first to complete your checkout sequence 🧑‍🌾");
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Load cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.toString().replace("₹", "").trim());
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address) {
      setError("Please fill out all required shipping fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customerName: shippingInfo.fullName,
        address: shippingInfo.address,
        phoneNumber: shippingInfo.phoneNumber,
        paymentMethod: shippingInfo.paymentMethod,
        items: cartItems,
        totalPrice: total + 40, // subtotal + delivery
      };

      await API.post("/api/orders/place", orderPayload);

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Redirect
      navigate("/OrderSuccess");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Checkout transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-10 text-center md:text-left">
            Checkout 🧾
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <span className="text-6xl">🛒</span>
              <h2 className="text-2xl font-bold mt-4 text-green-950">Nothing to Checkout</h2>
              <button
                onClick={() => navigate("/products")}
                className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-2xl mt-6 cursor-pointer"
              >
                Go Shop Products
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Shipping Form Card */}
              <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Details</h2>

                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Jane Doe"
                      value={shippingInfo.fullName}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={shippingInfo.phoneNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Delivery Address</label>
                    <textarea
                      name="address"
                      required
                      placeholder="Enter full shipping address..."
                      rows="4"
                      value={shippingInfo.address}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={shippingInfo.paymentMethod}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-4 rounded-2xl outline-none bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300 font-semibold text-gray-700"
                    >
                      <option value="Cash On Delivery">Cash On Delivery (COD)</option>
                      <option value="UPI Payment">UPI Payment</option>
                      <option value="Credit/Debit Card">Credit/Debit Card</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-green-700/10 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:bg-green-400 mt-8"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Place Order 🌾"
                    )}
                  </button>
                </form>
              </div>

              {/* Summary Items Card */}
              <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-3xl shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const price = parseFloat(item.price.toString().replace("₹", "").trim());
                    return (
                      <div key={index} className="flex justify-between items-center text-lg font-medium text-gray-600">
                        <span className="truncate max-w-[250px]">{item.name} <span className="text-sm text-gray-400 font-normal">x {item.quantity}</span></span>
                        <span>₹{price * (item.quantity || 1)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 my-6 pt-6 space-y-4">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Delivery Fee</span>
                    <span>₹40</span>
                  </div>
                  <div className="flex justify-between text-green-800 font-extrabold text-3xl pt-2 border-t border-gray-100">
                    <span>Total Price</span>
                    <span>₹{total + 40}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}