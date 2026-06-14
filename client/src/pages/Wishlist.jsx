import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to view your wishlist ❤️");
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/auth/me");
      setWishlistItems(res.data.wishlist || []);
    } catch (err) {
      console.error(err);
      alert("Failed to retrieve profile wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.post(`/api/products/${productId}/wishlist`);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      
      // Update local storage user profile wishlist ids
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.wishlist = storedUser.wishlist.filter((id) => id !== productId);
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from wishlist.");
    }
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = existingCart.findIndex((item) => item._id === product._id);

    if (productIndex !== -1) {
      existingCart[productIndex].quantity = (existingCart[productIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${product.name} added to cart! 🛒`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-gray-500 font-medium">Loading wishlist...</span>
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-10 text-center md:text-left">
            My Wishlist ❤️
          </h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <span className="text-6xl">❤️</span>
              <h2 className="text-2xl font-bold mt-4 text-green-950">Your Wishlist is Empty</h2>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                Save items that you like to purchase later by tapping the heart icon.
              </p>
              <Link to="/products">
                <button className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-2xl mt-6 cursor-pointer">
                  Browse Produce
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {wishlistItems.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur hover:bg-white p-3 rounded-full shadow-md z-10 transition hover:scale-110 active:scale-95 cursor-pointer text-red-500 font-bold"
                  >
                    ✕
                  </button>

                  <Link to={`/products/${product._id}`}>
                    <div className="overflow-hidden h-60 bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {product.category}
                      </span>

                      <Link to={`/products/${product._id}`}>
                        <h2 className="text-2xl font-bold text-gray-900 hover:text-green-700 transition mt-2">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                          <div className="text-2xl font-extrabold text-green-700">₹{product.price}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 text-sm"
                        >
                          Add To Cart 🛒
                        </button>
                      </div>
                    </div>
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
