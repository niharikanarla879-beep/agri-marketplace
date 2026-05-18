import Navbar from "../components/Navbar";

export default function FarmerDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-5xl font-bold text-green-800 mb-10">
          Farmer Dashboard 🌾
        </h1>
        <div className="grid md:grid-cols-3 gap-6 mb-10">

  <div className="bg-green-700 text-white p-6 rounded-3xl shadow-xl">
    <h2 className="text-2xl font-bold">
      Total Products
    </h2>

    <p className="text-5xl font-bold mt-4">
      12
    </p>
  </div>

  <div className="bg-yellow-500 text-white p-6 rounded-3xl shadow-xl">
    <h2 className="text-2xl font-bold">
      Total Orders
    </h2>

    <p className="text-5xl font-bold mt-4">
      48
    </p>
  </div>

  <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl">
    <h2 className="text-2xl font-bold">
      Earnings
    </h2>

    <p className="text-5xl font-bold mt-4">
      ₹12,500
    </p>
  </div>

</div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Products
            </h2>

            <p className="text-gray-600 text-lg">
              Manage your listed products.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Products
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Orders
            </h2>

            <p className="text-gray-600 text-lg">
              Track customer orders easily.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Orders
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Earnings
            </h2>

            <p className="text-gray-600 text-lg">
              Monitor your total earnings.
            </p>

            <button className="bg-green-700 text-white px-6 py-3 rounded-2xl mt-6 hover:bg-green-800 transition duration-300">
              View Earnings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}