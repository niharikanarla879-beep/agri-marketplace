import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
    const navigate = useNavigate();

  const cartItems =
    JSON.parse(localStorage.getItem("cart")) || [];

  const total = cartItems.reduce((sum, item) => {

    const price = parseInt(
      item.price.toString().replace("₹", "")
    );

    return sum + price;

  }, 0);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-10 grid md:grid-cols-2 gap-10">

        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <h1 className="text-5xl font-bold text-green-700 mb-10">
            Checkout 🧾
          </h1>

          <form className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-4 rounded-2xl"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border p-4 rounded-2xl"
            />

            <textarea
              placeholder="Delivery Address"
              rows="5"
              className="w-full border p-4 rounded-2xl"
            ></textarea>

            <select
              className="w-full border p-4 rounded-2xl"
            >

              <option>
                Cash On Delivery
              </option>

              <option>
                UPI Payment
              </option>

              <option>
                Credit/Debit Card
              </option>

            </select>
            <button
              type="button"
              onClick={async () => {
  try {

    const orderData = {
      customerName: "Niharika",
      products: cartItems,
      totalPrice: total,
      address: "Hyderabad"
    };

    const response = await axios.post(
      "https://agri-marketplace-backend.onrender.com/api/orders/place",
      orderData
    );

    alert("Order Placed Successfully");

    localStorage.removeItem("cart");
    setCartItems([]);

    navigate("/success");

  } catch (error) {

    console.log(error);

    alert("Order Failed");

  }
}}
            className="bg-green-700 text-white w-full py-4 rounded-2xl text-xl hover:bg-green-800"
            >
              Place Order
            </button>
            
          </form>

        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl h-fit">

          <h2 className="text-4xl font-bold mb-8">
            Order Summary
          </h2>

          {cartItems.map((item, index) => (

            <div
              key={index}
              className="flex justify-between mb-4 text-xl"
            >

              <span>{item.name}</span>

              <span>{item.price}</span>

            </div>
          ))}

          <hr className="my-6" />

          <div className="flex justify-between text-3xl font-bold">

            <span>Total</span>

            <span>₹{total}</span>

          </div>

        </div>

      </div>

    </div>
  );
}