import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from '../page';
import { CartProvider } from '../context/CartContext';

// Mock fake fetch
const mockProducts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  description: 'Description',
  price: 10,
  image: 'https://fakestoreapi.com/img/test.jpg',
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('HomePage', () => {
  it('renders products after loading', async () => {
    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    // Show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('filters products by search', async () => {
    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'Product 1' } });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });

  it('shows error on fetch failure', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('shows "No products found" when search returns no results', async () => {
    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'xyznotfound' } });

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });



  it('loads more products when "Load More" is clicked', async () => {
    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', { name: /Load More/i });

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Product 7')).toBeInTheDocument();
    });
  });


  it('retries loading products after error', async () => {
    // المرة الأولى تفشل
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });


    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  });


  it('shows error message when API fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    const errorMessage = await screen.findByText(/Failed to fetch products/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('filters products based on search term', async () => {
    const mockProducts = [
      { id: 1, title: 'Apple iPhone', description: '', price: 100, image: 'https://fakestoreapi.com/img/test.jpg' },
      { id: 2, title: 'Samsung Galaxy', description: '', price: 120, image: 'https://fakestoreapi.com/img/test.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );


    await screen.findByText('Apple iPhone');

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'samsung' } });

    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    expect(screen.queryByText('Apple iPhone')).not.toBeInTheDocument();
  });

  it('shows "No products found" if no match in search', async () => {
    const mockProducts = [
      { id: 1, title: 'Apple', description: '', price: 100, image: 'https://fakestoreapi.com/img/test.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    await screen.findByText('Apple');

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'Samsung' } });

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });


});
