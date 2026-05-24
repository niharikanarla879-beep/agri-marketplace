import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-green-50 flex items-center justify-center px-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-6xl font-bold text-green-800 leading-tight">
              Fresh Products <br />
              Directly From Farmers 🌾
            </h1>

            <p className="text-gray-700 text-lg mt-6">
              Buy fresh vegetables, fruits, grains and dairy
              products directly from trusted farmers at
              affordable prices.
            </p>

            <Link to="/products">
              <button className="bg-green-700 text-white px-8 py-4 rounded-2xl mt-8 text-lg hover:bg-green-800 transition duration-300">
                Explore Products
              </button>
            </Link>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop"
              alt="farmer"
              className="w-full h-[500px] object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-20 px-10">
  <h2 className="text-5xl font-bold text-center text-green-800 mb-16">
    Why Choose Agri Marketplace?
  </h2>

  <div className="grid md:grid-cols-3 gap-10">

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
      <h3 className="text-3xl font-bold text-green-700 mb-4">
        Fresh Products
      </h3>

      <p className="text-gray-700 text-lg">
        We provide farm fresh vegetables, fruits and grains directly from trusted farmers.
      </p>
    </div>

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
      <h3 className="text-3xl font-bold text-green-700 mb-4">
        Affordable Prices
      </h3>

      <p className="text-gray-700 text-lg">
        Customers can buy products at affordable prices without middlemen.
      </p>
    </div>

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
      <h3 className="text-3xl font-bold text-green-700 mb-4">
        Farmer Support
      </h3>

      <p className="text-gray-700 text-lg">
        Farmers can directly sell products and increase their earnings efficiently.
      </p>
    </div>

  </div>
</div>

<div className="py-20 px-10 bg-gray-50">

  <h2 className="text-5xl font-bold text-center text-green-800 mb-16">
    Featured Products
  </h2>

  <div className="grid md:grid-cols-4 gap-8">
  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
      alt="vegetables"
      className="h-52 w-full object-cover rounded-2xl"
    />

    <h3 className="text-2xl font-bold mt-4">
      Fresh Vegetables
    </h3>

    <p className="text-green-700 text-xl mt-2">
      
    </p>
  </div>

  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
    <img
      src="https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?q=80&w=1000&auto=format&fit=crop"  
      alt="grains"
      className="h-52 w-full object-cover rounded-2xl"
    />

    <h3 className="text-2xl font-bold mt-4">
      Organic Grains
    </h3>

    <p className="text-green-700 text-xl mt-2">
      
    </p>
  </div>

  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
    <img
      src="https://plus.unsplash.com/premium_photo-1722945635992-8eda6a907978?q=80&w=760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="seeds"
      className="h-52 w-full object-cover rounded-2xl"
    />

    <h3 className="text-2xl font-bold mt-4">
      Hybrid Seeds
    </h3>

    <p className="text-green-700 text-xl mt-2">
      
    </p>
  </div>

  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
    <img
      src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"  
      alt="fertilizer"
      className="h-52 w-full object-cover rounded-2xl"
    />

    <h3 className="text-2xl font-bold mt-4">
      Fertilizers
    </h3>

    <p className="text-green-700 text-xl mt-2">
      
    </p>
  </div>

  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
    <img
      src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop"
      alt="dairy"
      className="h-52 w-full object-cover rounded-2xl"
    />

    <h3 className="text-2xl font-bold mt-4">
      Dairy Products
    </h3>

    <p className="text-green-700 text-xl mt-2">
      
    </p>
  </div>
  <div className="bg-white p-5 rounded-3xl shadow-lg hover:scale-105 transition duration-300">
  <img
    src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b"
    alt="fruits"
    className="h-52 w-full object-cover rounded-2xl"
  />

  <h3 className="text-2xl font-bold mt-4">
    Fruits
  </h3>

  <p className="text-green-700 text-xl mt-2">
    
  </p>
</div>
  
  </div>

</div> 
<div className="py-20 px-10 bg-green-50">

  <h2 className="text-5xl font-bold text-center text-green-800 mb-16">
    Our Services
  </h2>

  <div className="grid md:grid-cols-4 gap-8">

    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-4">🚚 Fast Delivery</h3>
      <p>Quick and safe delivery of fresh farm products.</p>
    </div>

    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-4">🌱 Organic Products</h3>
      <p>Healthy and chemical-free organic farm products.</p>
    </div>

    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-4">💳 Secure Payments</h3>
      <p>Safe and trusted online payment methods.</p>
    </div>

    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-2xl font-bold mb-4">👨‍🌾 Farmer Support</h3>
      <p>Helping farmers sell products directly to customers.</p>
    </div>

  </div>

</div> 
<div className="py-20 px-10 bg-white">

  <h2 className="text-5xl font-bold text-center text-green-800 mb-16">
    What Customers Say
  </h2>

  <div className="grid md:grid-cols-3 gap-10">

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg">
      <p className="text-lg text-gray-700">
        "Fresh vegetables and fast delivery. Really happy with the service!"
      </p>

      <h3 className="text-2xl font-bold text-green-700 mt-6">
        - Ramesh
      </h3>
    </div>

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg">
      <p className="text-lg text-gray-700">
        "Best platform for farmers to sell products directly."
      </p>

      <h3 className="text-2xl font-bold text-green-700 mt-6">
        - Suresh
      </h3>
    </div>

    <div className="bg-green-50 p-8 rounded-3xl shadow-lg">
      <p className="text-lg text-gray-700">
        "Organic products quality is amazing and prices are affordable."
      </p>

      <h3 className="text-2xl font-bold text-green-700 mt-6">
        - Priya
      </h3>
    </div>

  </div>

</div>
<div className="py-20 px-10 bg-green-700 text-white">

  <div className="grid md:grid-cols-4 gap-10 text-center">

    <div>
      <h1 className="text-5xl font-bold">500+</h1>
      <p className="text-xl mt-4">Farmers</p>
    </div>

    <div>
      <h1 className="text-5xl font-bold">10K+</h1>
      <p className="text-xl mt-4">Customers</p>
    </div>

    <div>
      <h1 className="text-5xl font-bold">50+</h1>
      <p className="text-xl mt-4">Products</p>
    </div>

    <div>
      <h1 className="text-5xl font-bold">20+</h1>
      <p className="text-xl mt-4">Cities Served</p>
    </div>

  </div>

</div>
<div className="py-20 px-10 bg-gray-50">

  <h2 className="text-5xl font-bold text-center text-green-800 mb-16">
    Frequently Asked Questions
  </h2>

  <div className="space-y-6 max-w-4xl mx-auto">

    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-green-700">
        How do I order products?
      </h3>

      <p className="text-gray-700 mt-3 text-lg">
        Browse products, add them to cart and place your order easily.
      </p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-green-700">
        Are products organic?
      </h3>

      <p className="text-gray-700 mt-3 text-lg">
        Yes, we provide fresh and organic farm products directly from farmers.
      </p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-green-700">
        Is delivery available in all cities?
      </h3>

      <p className="text-gray-700 mt-3 text-lg">
        Currently we deliver in selected cities and expanding gradually.
      </p>
    </div>

  </div>

</div>
<div className="py-20 px-10 bg-green-800 text-white text-center">

  <h2 className="text-5xl font-bold mb-6">
    Subscribe To Our Newsletter
  </h2>

  <p className="text-xl mb-10 text-green-100">
    Get updates about fresh products, offers and farming tips.
  </p>

  <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">

    <input
      type="email"
      placeholder="Enter your email"
      className="flex-1 p-4 rounded-2xl text-black outline-none"
    />

    <button className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-300 transition duration-300">
      Subscribe
    </button>

  </div>

</div>
<div className="bg-green-700 text-white py-20 px-10">
  <h2 className="text-5xl font-bold text-center mb-16">
    Contact Us
  </h2>

  <div className="grid md:grid-cols-2 gap-12 items-center">

    <div>
      <h3 className="text-3xl font-bold mb-6">
        Get In Touch
      </h3>

      <p className="text-lg mb-4">
        📍 Hyderabad, Telangana
      </p>

      <p className="text-lg mb-4">
        📞 +91 9876543210
      </p>

      <p className="text-lg mb-4">
        📧 agrimarketplace@gmail.com
      </p>

      <p className="text-lg mt-8 text-green-100">
        We connect farmers and customers through a smart digital marketplace.
      </p>
    </div>

    <div className="bg-white p-8 rounded-3xl shadow-xl">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border p-4 rounded-xl mb-4 text-black outline-none"
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full border p-4 rounded-xl mb-4 text-black outline-none"
      />

      <textarea
        placeholder="Your Message"
        rows="5"
        className="w-full border p-4 rounded-xl mb-4 text-black outline-none"
      ></textarea>

      <button className="bg-green-700 text-white px-8 py-3 rounded-xl hover:bg-green-800 transition duration-300">
        Send Message
      </button>
    </div>

  </div>
</div>
      <Footer />
    </div>
    
  );
}