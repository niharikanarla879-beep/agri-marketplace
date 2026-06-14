import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      } else {
        setUser(null);
      }
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    checkAuth();
    updateCartCount();

    window.addEventListener("storage", () => {
      checkAuth();
      updateCartCount();
    });
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("authUpdated", checkAuth);

    return () => {
      window.removeEventListener("storage", () => {
        checkAuth();
        updateCartCount();
      });
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("authUpdated", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    
    // Dispatch auth update
    window.dispatchEvent(new Event("authUpdated"));
    
    alert("Logged out successfully");
    navigate("/");
  };

  const isFarmer = user?.role === "farmer";
  const isCustomer = user?.role === "customer";

  return (
    <nav className="bg-green-800 text-white px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center shadow-md border-b border-green-900 sticky top-0 z-50 backdrop-blur-md bg-green-800/95">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-[1.02] transition duration-300">
          <span className="text-3xl">🌾</span>
          <span>Agri Marketplace</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-6 md:gap-8 items-center text-sm md:text-base font-semibold mt-4 md:mt-0">
        <Link to="/" className="hover:text-yellow-400 transition duration-300">
          Home
        </Link>
        
        <Link to="/products" className="hover:text-yellow-400 transition duration-300">
          Products
        </Link>

        {isFarmer && (
          <>
            <Link to="/farmer" className="hover:text-yellow-400 transition duration-300">
              Farmer Dashboard
            </Link>
            <Link to="/add-product" className="hover:text-yellow-400 transition duration-300">
              Add Product
            </Link>
          </>
        )}

        {isCustomer && (
          <>
            <Link to="/wishlist" className="hover:text-yellow-400 transition duration-300 flex items-center gap-1">
              Wishlist ❤️
            </Link>
            <Link to="/customer-dashboard" className="hover:text-yellow-400 transition duration-300">
              My Profile
            </Link>
            <Link to="/cart" className="relative hover:text-yellow-400 transition duration-300 flex items-center gap-1">
              Cart 🛒
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-yellow-400 text-green-950 font-bold text-xs px-2 py-0.5 rounded-full shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/cart" className="relative hover:text-yellow-400 transition duration-300 flex items-center gap-1">
              Cart 🛒
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-yellow-400 text-green-950 font-bold text-xs px-2 py-0.5 rounded-full shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="hover:text-yellow-400 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="bg-yellow-400 text-green-900 px-4 py-2 rounded-xl hover:bg-yellow-300 hover:text-green-950 transition duration-300 shadow">
              Register
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-400 font-semibold transition duration-300 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500/10 cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}