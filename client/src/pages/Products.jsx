import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Products() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fresh Apples",
      price: "₹120",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    },

    {
      id: 2,
      name: "Tomatoes",
      price: "₹60",
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
    },
 
  {
    id: 3,
    name: "Potatoes",
    price: "₹40",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655"
  },
  {
    id: 4,
    name: "Onions",
    price: "₹50",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510"
  },
  {
    id: 5,
    name: "Carrots",
    price: "₹70",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979"
  },
  {
    id: 6,
    name: "Leafy Greens",
    price: "₹45",
    image: "https://images.pexels.com/photos/257259/pexels-photo-257259.jpeg"
  },
  {
    id: 7,
    name: "Rice Bags",
    price: "₹950",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c"
  },
  {
    id: 8,
    name: "Organic Wheat",
    price: "₹780",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"
  },
  {
    id: 9,
    name: "Fertilizers",
    price: "₹450",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b"
  },
 
  {
    id: 10,
    name: "Fresh Milk",
    price: "₹65",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150"
  },
  {
  id: 11,
  name: "Bananas",
  price: "₹50",
  image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
},
{
  id: 12,
  name: "Mangoes",
  price: "₹150",
  image: "https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg"
},
{
  id: 13,
  name: "Grapes",
  price: "₹90",
  image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg"
},
{
  id: 14,
  name: "Watermelon",
  price: "₹120",
  image: "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg"
}
  
  ]);
   

  useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      const farmerProducts =
        JSON.parse(localStorage.getItem("products")) || [];

      setProducts((prev) => [ 
        ...prev.slice(0,14),
        ...data,
        ...farmerProducts,
      ]);
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