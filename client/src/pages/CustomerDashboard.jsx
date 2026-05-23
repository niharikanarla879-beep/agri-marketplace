import Navbar from "../components/Navbar";    

export default function CustomerDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-5xl font-bold text-green-800 mb-10">
          Customer Dashboard 🛒
        </h1>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="bg-green-700 text-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold">
              Total Orders
            </h2>

            <p className="text-5xl font-bold mt-4">
              18
            </p>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold">
              Wishlist
            </h2>

            <p className="text-5xl font-bold mt-4">
              9
            </p>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold">
              Cart Items
            </h2>

            <p className="text-5xl font-bold mt-4">
              5
            </p>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold">
              Total Spent
            </h2>

            <p className="text-5xl font-bold mt-4">
              ₹8K
            </p>
          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop"
              alt="orders"
              className="h-52 w-full object-cover rounded-2xl"
            />

            <h2 className="text-3xl font-bold mt-6 mb-4">
              My Orders
            </h2>

            <p className="text-gray-600 text-lg">
              Track all your recent product orders and deliveries.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Orders
            </button>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop"
              alt="wishlist"
              className="h-52 w-full object-cover rounded-2xl"
            />

            <h2 className="text-3xl font-bold mt-6 mb-4">
              Wishlist
            </h2>

            <p className="text-gray-600 text-lg">
              Save your favourite products for future purchases.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Wishlist
            </button>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1000&auto=format&fit=crop"
              alt="cart"
              className="h-52 w-full object-cover rounded-2xl"
            />

            <h2 className="text-3xl font-bold mt-6 mb-4">
              Cart Summary
            </h2>

            <p className="text-gray-600 text-lg">
              Check products added to your shopping cart.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}