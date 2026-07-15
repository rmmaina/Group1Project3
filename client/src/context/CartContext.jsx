import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'library_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (book, quantity = 1) => {
    const bookId = book.backendId || book.id;
    if (!bookId) return;

    setItems((prev) => {
      const existing = prev.find((entry) => entry.bookId === bookId);
      if (existing) {
        return prev.map((entry) =>
          entry.bookId === bookId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [
        ...prev,
        {
          bookId,
          quantity,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl || book.cover_url,
          price: typeof book.price === 'number' ? book.price : 0,
        },
      ];
    });
  };

  const removeFromCart = (bookId) => {
    setItems((prev) => prev.filter((entry) => entry.bookId !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prev) =>
      prev.map((entry) => (entry.bookId === bookId ? { ...entry, quantity } : entry))
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = items.reduce((sum, entry) => sum + entry.quantity * (entry.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}