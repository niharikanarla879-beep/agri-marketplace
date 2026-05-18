import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AddProduct() {

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    existingProducts.push(product);

    localStorage.setItem(
      "products",
      JSON.stringify(existingProducts)
    );

    alert("Product Added Successfully 🌾");

    setProduct({
      name: "",
      price: "",
      image: "",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex justify-center p-10">

        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

          <h1 className="text-5xl font-bold text-green-700 mb-10 text-center">
            Add Product 🌱
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="text-xl font-semibold">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full border p-4 rounded-2xl mt-2"
              />
            </div>

            <div>
              <label className="text-xl font-semibold">
                Price
              </label>

              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full border p-4 rounded-2xl mt-2"
              />
            </div>

            <div>
              <label className="text-xl font-semibold">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="w-full border p-4 rounded-2xl mt-2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white w-full py-4 rounded-2xl text-xl hover:bg-green-800"
            >
              Add Product
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}