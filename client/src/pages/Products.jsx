import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Seeds", "Fertilizers", "Dairy"];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setWishlist(parsed.wishlist || []);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, activeCategory, sortBy, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/products", {
        params: {
          search,
          category: activeCategory,
          sort: sortBy,
          page,
          limit: 9,
        },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please login to manage your wishlist ❤️");
      navigate("/login");
      return;
    }

    try {
      const res = await API.post(`/api/products/${product._id}/wishlist`);
      let updatedWishlist = [...wishlist];
      if (res.data.isWishlisted) {
        updatedWishlist.push(product._id);
      } else {
        updatedWishlist = updatedWishlist.filter((id) => id !== product._id);
      }

      setWishlist(updatedWishlist);

      // Save back to local storage user object
      const updatedUser = { ...user, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle wishlist");
    }
  };

  const getAvgRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">Fresh Produce & Farming Supplies</h1>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-lg">
              Buy directly from the farmers who grow them, supporting local rural families.
            </p>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full border border-gray-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">🔍</span>
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 p-3.5 rounded-2xl outline-none bg-white font-semibold text-gray-700 focus:border-green-600 transition duration-300 w-full md:w-auto"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-green-700 text-white shadow-md shadow-green-700/10 scale-105"
                    : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State / Empty State / Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-60 bg-gray-100 rounded-2xl"></div>
                  <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-5 bg-gray-200 w-1/4 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <span className="text-6xl">🌾</span>
              <h3 className="text-2xl font-bold mt-4 text-green-950">No Products Found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                We couldn't find any products matching your current search criteria. Try using different keywords or filter.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => {
                const avgRating = getAvgRating(product);
                const isWishlisted = wishlist.includes(product._id);
                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur hover:bg-white p-3 rounded-full shadow-md z-10 hover:scale-110 active:scale-95 transition cursor-pointer"
                    >
                      <span className="text-lg">{isWishlisted ? "❤️" : "🤍"}</span>
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
                        <div className="flex justify-between items-center mb-2">
                          <span className="bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            {product.category}
                          </span>
                          {avgRating > 0 && (
                            <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                              ⭐ {avgRating} ({product.reviews.length})
                            </span>
                          )}
                        </div>

                        <Link to={`/products/${product._id}`}>
                          <h2 className="text-2xl font-bold text-gray-900 hover:text-green-700 transition">
                            {product.name}
                          </h2>
                        </Link>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                        
                        {product.farmer && (
                          <p className="text-gray-400 text-xs mt-3 flex items-center gap-1">
                            🧑‍🌾 Sold by: <span className="font-semibold text-gray-600">{product.farmer.name}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                            <div className="text-2xl font-extrabold text-green-700">₹{product.price}</div>
                          </div>
                          {product.inventory < 10 ? (
                            <span className="text-red-500 font-semibold text-xs bg-red-50 px-2 py-1 rounded">
                              Only {product.inventory} left
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs bg-green-50 px-2.5 py-1 rounded font-semibold">
                              In Stock
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition cursor-pointer flex justify-center items-center gap-2"
                        >
                          Add To Cart 🛒
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-white border border-gray-200 px-5 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="font-bold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-white border border-gray-200 px-5 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}