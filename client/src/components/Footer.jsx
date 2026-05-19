import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-green-800 text-white text-center py-6 mt-20">

      <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-3 gap-10">

        <div>
          <h1 className="text-3xl font-bold mb-4">
            🌾 Agri Marketplace
          </h1>

          <p className="text-gray-200">
            Fresh vegetables, fruits and dairy products
            directly from trusted farmers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2 text-gray-200">
  <li>
    <Link to="/">Home</Link>
  </li>

  <li>
    <Link to="/products">Products</Link>
  </li>

  <li>
    <Link to="/cart">Cart</Link>
  </li>

  <li>
    <Link to="/login">Login</Link>
  </li>
</ul>
          
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Contact
          </h2>

          <p className="text-gray-200">
            📧 agrimarket@gmail.com
          </p>

          <p className="text-gray-200 mt-2">
            📍 Hyderabad, India
          </p>
        </div>

      </div>

      <div className="text-center text-gray-300 mt-10">
        © 2026 Agri Marketplace. All Rights Reserved.
      </div>

    </footer>
  );
}