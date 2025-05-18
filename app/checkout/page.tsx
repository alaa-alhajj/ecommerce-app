"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
    });
    const [showThankYou, setShowThankYou] = useState(false);


    useEffect(() => {
        const savedData = localStorage.getItem("checkoutForm");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            localStorage.setItem("checkoutForm", JSON.stringify(updated));
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        setShowThankYou(true);

        clearCart();
        localStorage.removeItem("checkoutForm");
        setTimeout(() => {
            router.push("/");
        }, 10000);
    };

    if (showThankYou) {
        return (
            <main className="flex flex-col items-center justify-center h-screen text-center p-4">
                <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
                <p>You will be redirected to the home page shortly.</p>
            </main>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>

            <div>
                <label htmlFor="fullName" className="block mb-1 font-semibold">
                    Full Name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
            </div>

            <div>
                <label htmlFor="email" className="block mb-1 font-semibold">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
            </div>

            <div>
                <label htmlFor="address" className="block mb-1 font-semibold">
                    Address
                </label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
            </div>

            <div>
                <label htmlFor="city" className="block mb-1 font-semibold">
                    City
                </label>
                <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
            </div>

            <div>
                <label htmlFor="postalCode" className="block mb-1 font-semibold">
                    Postal Code
                </label>
                <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
            </div>
            <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
                Place Order
            </button>
        </form>
    );
}
