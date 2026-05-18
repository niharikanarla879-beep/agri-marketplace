import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex justify-center items-center p-10">

        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg">

          <h1 className="text-5xl font-bold text-center text-green-700 mb-10">
            Login 🌱
          </h1>

          <form className="space-y-6">

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
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">
                Login As
              </label>

              <select className="w-full border p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-green-600">

                <option>
                  Customer
                </option>

                <option>
                  Farmer
                </option>

                <option>
                  Admin
                </option>

              </select>
            </div>

            <button className="bg-green-700 text-white w-full py-4 rounded-2xl text-xl hover:bg-green-800 transition duration-300">
              Login
            </button>

          </form>

          <p className="text-center text-gray-600 mt-8">
            Don’t have an account?
            <span className="text-green-700 font-bold cursor-pointer ml-2">
              Register
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}