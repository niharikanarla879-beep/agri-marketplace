import Navbar from "../components/Navbar";

export default function AdminDashboard() {

  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const deleteProduct = (index) => {

    const updatedProducts =
      products.filter((_, i) => i !== index);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    window.location.reload();
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-5xl font-bold text-red-600 mb-10">
          Admin Dashboard 👨‍💼
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {products.map((product, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-5"
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
                  deleteProduct(index)
                }

                className="bg-red-500 text-white w-full py-4 rounded-2xl mt-6 hover:bg-red-600"
              >
                Delete Product
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}