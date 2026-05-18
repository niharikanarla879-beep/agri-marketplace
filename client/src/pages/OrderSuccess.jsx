import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex justify-center items-center p-10">

        <div className="bg-white shadow-2xl rounded-3xl p-16 text-center max-w-2xl">

          <h1 className="text-6xl mb-6">
            🎉
          </h1>

          <h2 className="text-5xl font-bold text-green-700 mb-6">
            Order Placed Successfully!
          </h2>

          <p className="text-xl text-gray-600 mb-10">
            Thank you for shopping with Agri Marketplace 🌾
          </p>

          <Link to="/products">

            <button className="bg-green-700 text-white px-10 py-4 rounded-2xl text-xl hover:bg-green-800">
              Continue Shopping
            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}