import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setWishlist(parsed.wishlist || []);
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      alert("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
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

  const toggleWishlist = async () => {
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
        updatedWishlist = updatedWishlist.filter((wid) => wid !== product._id);
      }

      setWishlist(updatedWishlist);

      const updatedUser = { ...user, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle wishlist");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setReviewError("Please write a review comment.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");

    try {
      await API.post(`/api/products/${id}/review`, { rating, comment });
      alert("Review posted successfully! ⭐");
      setComment("");
      setRating(5);
      fetchProduct(); // reload product detail with new review
    } catch (err) {
      console.error(err);
      setReviewError(err.response?.data?.error || "Failed to post review. You may have already reviewed this product.");
    } finally {
      setReviewLoading(false);
    }
  };

  const getAvgRating = () => {
    if (!product || !product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-gray-500 font-medium">Fetching fresh details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const avgRating = getAvgRating();
  const isWishlisted = product ? wishlist.includes(product._id) : false;
  const isCustomer = user?.role === "customer";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link to="/products" className="text-green-800 hover:text-green-900 font-bold flex items-center gap-1 mb-8">
            ← Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-12 bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm mb-12">
            {/* Image Section */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 h-[300px] md:h-[450px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur hover:bg-white p-3 rounded-full shadow-md z-10 transition hover:scale-110"
              >
                <span className="text-xl">{isWishlisted ? "❤️" : "🤍"}</span>
              </button>
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="bg-green-50 text-green-800 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider w-fit">
                  {product.category}
                </span>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">{product.name}</h1>

                <div className="flex items-center gap-3 mt-3">
                  {avgRating > 0 ? (
                    <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-xl text-sm font-bold">
                      ⭐ {avgRating} / 5.0
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">No reviews yet</span>
                  )}
                  <span className="text-gray-400 text-sm font-semibold">|</span>
                  <span className={`text-sm font-bold ${product.inventory < 10 ? "text-red-500" : "text-green-600"}`}>
                    {product.inventory < 10 ? `Only ${product.inventory} left in stock!` : "In Stock"}
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-green-800 mt-6">₹{product.price}</div>

                <p className="text-gray-600 text-lg mt-6 leading-relaxed border-t border-gray-100 pt-6">
                  {product.description}
                </p>

                {product.farmer && (
                  <div className="bg-green-50/50 rounded-2xl p-4 mt-6 border border-green-100/30">
                    <h4 className="font-bold text-green-950 text-sm">🧑‍🌾 Farmer Vendor Info</h4>
                    <p className="text-gray-600 text-sm mt-1">{product.farmer.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{product.farmer.email}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-green-700/10 active:scale-[0.98] transition cursor-pointer flex justify-center items-center gap-2"
                >
                  Add To Cart 🛒
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Reviews List */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                Customer Reviews ({product.reviews?.length || 0})
              </h2>

              {!product.reviews || product.reviews.length === 0 ? (
                <div className="py-12 bg-white rounded-3xl text-center border border-gray-100 shadow-sm text-gray-400">
                  <span className="text-4xl block mb-2">⭐</span>
                  No reviews yet. Be the first to leave a review!
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev._id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{rev.name}</h4>
                          <div className="text-yellow-500 text-sm mt-1">
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-semibold">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3 text-sm">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Review Form */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Write a Review</h3>

              {isCustomer ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewError && (
                    <div className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-xs font-semibold">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-200 p-3 rounded-xl outline-none bg-white font-semibold text-gray-700 focus:border-green-600 transition duration-300"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Poor)</option>
                      <option value={1}>⭐ (1 - Terrible)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Comments</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this fresh product..."
                      rows="4"
                      required
                      className="w-full border border-gray-200 p-3 rounded-xl outline-none text-sm focus:border-green-600 focus:ring-1 focus:ring-green-100 transition duration-300"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-sm shadow cursor-pointer active:scale-[0.98] transition disabled:bg-green-400"
                  >
                    {reviewLoading ? "Posting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  {user ? (
                    "Only customers can write product reviews. Farmers/Admins are excluded."
                  ) : (
                    <>
                      Please{" "}
                      <Link to="/login" className="text-green-700 font-bold hover:underline">
                        login
                      </Link>{" "}
                      as a Customer to write a review.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
