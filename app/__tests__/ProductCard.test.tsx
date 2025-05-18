import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 10,
  image: 'https://fakestoreapi.com/img/test.jpg',
};

describe('ProductCard', () => {
  it('renders product info and handles cart actions', () => {
    const onAddToCart = jest.fn();
    const onRemoveFromCart = jest.fn();

    render(
      <CartProvider>
        <ProductCard
          product={mockProduct}
          isInCart={false}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
      </CartProvider>
    );

    // Check product info
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();

    // Simulate clicking add to cart
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
