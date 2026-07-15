import React from 'react';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function Cart({ onCheckout }) {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={48} />
        <h3>Your cart is empty</h3>
        <p>Browse the catalog and add a book to get started.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.bookId} className="cart-item">
            <img src={item.coverUrl} alt={item.title} className="cart-item-cover" />
            <div className="cart-item-details">
              <h4>{item.title}</h4>
              <p>By {item.author}</p>
              <span className="cart-item-price">${(item.price || 0).toFixed(2)} each</span>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.bookId, item.quantity - 1)}>
                <Minus size={14} />
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.bookId, item.quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>
            <div className="cart-item-subtotal">
              ${((item.price || 0) * item.quantity).toFixed(2)}
            </div>
            <button className="cart-item-remove" onClick={() => removeFromCart(item.bookId)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <span className="cart-total-amount">${cartTotal.toFixed(2)}</span>
      </div>

      <button className="checkout-btn" onClick={onCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
}
