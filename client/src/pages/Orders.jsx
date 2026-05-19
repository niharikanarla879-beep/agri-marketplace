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

    <div style={{ padding: "20px" }}>

      <h1>Orders</h1>

      {orders.map((order, index) => (

        <div
          key={index}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >

          <h2>{order.customerName}</h2>

          <p>{order.address}</p>

          <p>Total: ₹{order.totalPrice}</p>

        </div>

      ))}

    </div>

  );
}