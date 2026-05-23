import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Products() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
   

  useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      const farmerProducts =
        JSON.parse(localStorage.getItem("products")) || [];

      setProducts([...data, ...farmerProducts]);
    })
    .catch((err) => console.log(err));
}, []);

  const addToCart = (product) => {

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    existingCart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    navigate("/cart");
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-10">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border p-4 rounded-xl shadow"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-10">

          {products
            .filter((product) =>
              product.name
                .toLowerCase()
                .includes(search.toLowerCase())
            )

            .map((product, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-5 hover:scale-105 transition duration-300"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-60 w-full object-cover rounded-2xl"
                />

                <h2 className="text-3xl font-bold mt-5">
                  {product.name}
                </h2>

                <p className="text-green-700 text-2xl font-bold mt-3">
                  {product.price}
                </p>

                <button
                  onClick={() =>
                    addToCart(product)
                  }

                  className="bg-green-700 text-white w-full py-4 rounded-2xl mt-6 hover:bg-green-800"
                >
                  Add To Cart
                </button>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
}