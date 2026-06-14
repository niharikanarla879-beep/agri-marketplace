import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  };

  const saveCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.toString().replace("₹", "").trim());
    return sum + price * (item.quantity || 1);
  }, 0);

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const increaseQuantity = (index) => {
    const updated = [...cartItems];
    updated[index].quantity = (updated[index].quantity || 1) + 1;
    saveCart(updated);
  };

  const decreaseQuantity = (index) => {
    const updated = [...cartItems];
    if ((updated[index].quantity || 1) > 1) {
      updated[index].quantity -= 1;
      saveCart(updated);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-10">
            Shopping Cart 🛒
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <span className="text-6xl">🛒</span>
              <h2 className="text-2xl font-bold mt-4 text-green-950">Your Cart is Empty</h2>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet. Explore our fresh produce.
              </p>
              <Link to="/products">
                <button className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-2xl mt-6 active:scale-[0.98] transition cursor-pointer">
                  Shop Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => {
                  const itemPrice = parseFloat(item.price.toString().replace("₹", "").trim());
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition duration-300"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-2xl bg-gray-50"
                      />

                      <div className="flex-1 flex flex-col sm:flex-row justify-between items-center sm:items-start w-full">
                        <div className="text-center sm:text-left">
                          <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                          <p className="text-green-700 font-extrabold text-lg mt-1">₹{itemPrice}</p>
                        </div>

                        <div className="flex flex-col items-center sm:items-end gap-3 mt-4 sm:mt-0">
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 p-1.5 rounded-2xl">
                            <button
                              onClick={() => decreaseQuantity(index)}
                              className="bg-white hover:bg-gray-100 border border-gray-200 w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center transition cursor-pointer active:scale-95 text-gray-600"
                            >
                              -
                            </button>

                            <span className="text-lg font-bold w-6 text-center">
                              {item.quantity || 1}
                            </span>

                            <button
                              onClick={() => increaseQuantity(index)}
                              className="bg-green-700 hover:bg-green-800 text-white w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center transition cursor-pointer active:scale-95"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const itemPrice = parseFloat(item.price.toString().replace("₹", "").trim());
                    return (
                      <div key={index} className="flex justify-between text-gray-600 font-medium">
                        <span className="truncate max-w-[200px]">
                          {item.name} x {item.quantity || 1}
                        </span>
                        <span>₹{itemPrice * (item.quantity || 1)}</span>
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
                    <span>Total</span>
                    <span>₹{total + 40}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-green-700/10 active:scale-[0.98] transition cursor-pointer"
                >
                  Proceed To Checkout
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Free and safe delivery direct from agricultural sites.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}