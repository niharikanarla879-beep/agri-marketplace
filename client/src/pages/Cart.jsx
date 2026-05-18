import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems =
    JSON.parse(localStorage.getItem("cart")) || [];

  const total = cartItems.reduce((sum, item) => {
  const price = parseInt(
    item.price.toString().replace("₹", "")
  );

  return sum + price;
}, 0);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter(
      (_, i) => i !== index
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.location.reload();
  };

  return (
    <div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-5xl font-bold text-green-700 mb-10">
          My Cart 🛒
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl p-6 flex gap-6 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 h-40 object-cover rounded-xl"
                />

                <div>
                  <h2 className="text-3xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-green-700 text-2xl mt-3 font-bold">
                    {item.price}
                  </p>

                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white px-6 py-2 rounded-xl mt-4 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-10 h-fit">
            <h2 className="text-4xl font-bold mb-8">
              Order Summary
            </h2>

            <div className="flex justify-between text-xl mb-4">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between text-xl mb-4">
              <span>Delivery</span>
              <span>₹40</span>
            </div>

            <div className="flex justify-between text-4xl font-bold mt-10">
              <span>Total</span>
              <span>₹{total + 40}</span>
            </div>

            <button 
             onClick={() => navigate("/Checkout")}
             className="bg-green-700 text-white w-full py-4 rounded-2xl mt-10 text-xl hover:bg-green-800">
               Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}