"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();


  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    if (cart.length === 0) return {};
    return cart.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {} as Record<number, number>);
  });

 
  useEffect(() => {
    if (cart.length === 0) {
      setQuantities({});
      return;
    }

    const initialQuantities = cart.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {} as Record<number, number>);
    setQuantities(initialQuantities);
  }, [cart]);

  const handleQuantityChange = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (quantities[item.id] || 1),
    0
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your cart is currently empty.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-medium text-base md:text-lg">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-sm">${product.price}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <input
                        type="number"
                        role="spinbutton"
                        min={1}
                        value={quantities[product.id] ?? 1}
                        onChange={(e) =>
                          handleQuantityChange(product.id, Number(e.target.value))
                        }
                        className="w-14 border rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-end gap-4">
            <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
              >
                Clear Cart
              </button>

              <Link
                href="/checkout"
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
