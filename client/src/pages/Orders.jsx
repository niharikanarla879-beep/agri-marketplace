import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://agri-marketplace-backend.onrender.com/api/orders"
      );

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-2xl font-bold">
              {order.fullName}
            </h2>

            <p>{order.phone}</p>

            <p>{order.address}</p>

            <p className="font-bold text-green-700 mt-2">
              ₹{order.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}