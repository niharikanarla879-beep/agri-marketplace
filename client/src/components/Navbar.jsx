import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-10 py-5 flex justify-between items-center shadow-lg">

      <h1 className="text-4xl font-bold">
        🌾 Agri Marketplace
      </h1>

      <div className="flex gap-8 text-lg font-medium">

        <Link
          to="/"
          className="hover:text-yellow-300 transition duration-300"
        >
          Home
        </Link>

        <Link
          to="/products"
          className="hover:text-yellow-300 transition duration-300"
        >
          Products
        </Link>

        <Link
          to="/cart"
          className="hover:text-yellow-300 transition duration-300"
        >
          Cart
        </Link>

        <Link
          to="/login"
          className="hover:text-yellow-300 transition duration-300"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="hover:text-yellow-300 transition duration-300"
        >
          Register
        </Link>
        
        <Link
          to="/farmer">
        </Link>
        
       </div>
    </nav>
  );
}