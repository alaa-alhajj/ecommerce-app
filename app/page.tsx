"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { useCart } from "./context/CartContext";
import { FaExclamationTriangle } from "react-icons/fa";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const { cart, addToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const getData = () => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const isProductInCart = (id) => cart.some((item) => item.id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status" className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <FaExclamationTriangle className="text-red-600 text-6xl mb-6" />
        <p className="text-red-600 text-xl mb-6">Oops! {error}</p>
        <button
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => {
            setError(null);
            setLoading(true);
            getData();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
      />

      {filteredProducts.length === 0 ? (
        <div className="w-full text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              isInCart={isProductInCart(product.id)}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />

          ))}
        </div>
      )}


      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
}
