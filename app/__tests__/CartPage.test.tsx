import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CartPage from '../cart/page';
import { useCart } from '../context/CartContext';
import Image from "next/image";

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { ...rest } = props;
    return <Image {...rest} />;
  },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  }),
}));

jest.mock('../context/CartContext');

describe('CartPage with empty cart', () => {
  beforeEach(() => {
    useCart.mockReturnValue({
      cart: [],
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    });
  });

  it('displays empty cart message', () => {
    render(<CartPage />);
    expect(screen.getByText(/your cart is currently empty/i)).toBeInTheDocument();
  });
});


describe('CartPage with product', () => {
  const mockRemoveFromCart = jest.fn();
  const mockClearCart = jest.fn();

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 19.99,
    image: 'https://fakestoreapi.com/img/test.jpg',
  };

  beforeEach(() => {
    useCart.mockReturnValue({
      cart: [mockProduct],
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart item and allows quantity change', async () => {
    await act(async () => {
      render(<CartPage />);
    });

    // Check if product title is displayed
    expect(screen.getByText(/test product/i)).toBeInTheDocument();

    // Check if price is displayed
    expect(screen.getByText('$19.99')).toBeInTheDocument();

    // Check if quantity input is visible and default is 1
    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(quantityInput.value).toBe('1');

    // Simulate quantity change
    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(quantityInput.value).toBe('2');
  });

  it('calls removeFromCart when ✕ is clicked', async () => {
    await act(async () => {
      render(<CartPage />);
    });

    const removeButton = screen.getByTitle('Remove');
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('calls clearCart when Clear Cart button is clicked', async () => {
    await act(async () => {
      render(<CartPage />);
    });

    const clearButton = screen.getByText(/clear cart/i);
    fireEvent.click(clearButton);

    expect(mockClearCart).toHaveBeenCalled();
  });
});
