import Navbar from "../components/Navbar";

export default function Register() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex justify-center items-center p-10">

        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

          <h1 className="text-5xl font-bold text-center text-green-700 mb-10">
            Register 🌱
          </h1>

          <form className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-lg font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="Enter your phone number"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Register As
              </label>

              <select className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600">

                <option>
                  Customer
                </option>

                <option>
                  Farmer
                </option>

              </select>
            </div>

            <div className="md:col-span-2">

              <button className="bg-green-700 text-white w-full py-4 rounded-2xl text-xl hover:bg-green-800 transition duration-300">
                Create Account
              </button>

            </div>

          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?
            <span className="text-green-700 font-bold cursor-pointer ml-2">
              Login
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}