import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "../checkout/page";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

// Mocking CartContext and next/router
jest.mock("../context/CartContext");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CheckoutPage", () => {
  let clearCartMock: jest.Mock;
  let pushMock: jest.Mock;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset mocks before each test
    clearCartMock = jest.fn();
    pushMock = jest.fn();

    // Mock cart context return value
    (useCart as jest.Mock).mockReturnValue({
      cart: [{ id: 1, title: "Test Product", price: 20, image: "" }],
      clearCart: clearCartMock,
    });

    // Mock useRouter return value
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    // Use real timers by default
    jest.useRealTimers();
  });

  it("renders all input fields and the submit button", () => {
    render(<CheckoutPage />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /place order/i })).toBeInTheDocument();
  });

  it("submits the form, shows thank you message, clears cart, and redirects", async () => {
    render(<CheckoutPage />);

    // Fill the form inputs
    await userEvent.clear(screen.getByLabelText(/full name/i));
    await userEvent.type(screen.getByLabelText(/full name/i), "Alaa");
    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), "alaa@example.com");
    await userEvent.clear(screen.getByLabelText(/address/i));
    await userEvent.type(screen.getByLabelText(/address/i), "123 Street");
    await userEvent.clear(screen.getByLabelText(/city/i));
    await userEvent.type(screen.getByLabelText(/city/i), "Damascus");
    await userEvent.clear(screen.getByLabelText(/postal code/i));
    await userEvent.type(screen.getByLabelText(/postal code/i), "12345");

    // Submit the form
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    // Wait for thank you message to appear
    await waitFor(() => {
      expect(screen.getByText(/thank you for your order/i)).toBeInTheDocument();
    }, { timeout: 15000 });

    // Check if cart was cleared
    expect(clearCartMock).toHaveBeenCalled();

    // Check if localStorage form data was cleared
    expect(localStorage.getItem("checkoutForm")).toBeNull();

    // Check if router push was called with "/"
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    }, { timeout: 15000 });
  }, 30000);

  it("saves form data to localStorage on change", async () => {
    render(<CheckoutPage />);
    const fullNameInput = screen.getByLabelText(/full name/i);
    
    // Type in the fullName input
    await userEvent.clear(fullNameInput);
    await userEvent.type(fullNameInput, "Alaa");

    // Check if localStorage was updated correctly
    const storedData = JSON.parse(localStorage.getItem("checkoutForm") || "{}");
    expect(storedData.fullName).toBe("Alaa");
  });

  it("loads saved form data from localStorage on mount", () => {
    // Set form data in localStorage before rendering
    localStorage.setItem(
      "checkoutForm",
      JSON.stringify({
        fullName: "Alaa",
        email: "alaa@example.com",
        address: "Somewhere",
        city: "Somecity",
        postalCode: "00000",
      })
    );

    render(<CheckoutPage />);

    // Check if inputs have loaded values from localStorage
    expect(screen.getByDisplayValue("Alaa")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alaa@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Somewhere")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Somecity")).toBeInTheDocument();
    expect(screen.getByDisplayValue("00000")).toBeInTheDocument();
  });
});
