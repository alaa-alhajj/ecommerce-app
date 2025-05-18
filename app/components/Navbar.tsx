"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { cart } = useCart();
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-gray-800">
                    E-Shop
                </Link>

                {/* Links */}
                <div className="flex items-center gap-6">
                    <Link href="/products" className="text-gray-600 hover:text-black">
                        Products
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
