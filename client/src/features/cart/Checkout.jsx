import React, { useState } from 'react';
import { CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { ordersApi } from '../../api/client.js';
import { showError, showSuccess } from '../../utils/swal.js';

const PAYMENT_METHODS = [
  { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { value: 'visa', label: 'Visa', icon: Landmark },
  { value: 'mpesa', label: 'M-Pesa', icon: Smartphone },
  { value: 'paypal', label: 'PayPal', icon: Wallet },
];

export default function Checkout({ onOrderComplete, onBack }) {
  const { items, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const payload = {
        items: items.map((item) => ({ book_id: item.bookId, quantity: item.quantity })),
        payment_method: paymentMethod,
      };
      const order = await ordersApi.create(payload);
      clearCart();
      showSuccess('Order placed', `Your order #${order.id} was placed successfully.`);
      if (onOrderComplete) onOrderComplete(order);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      showError('Checkout failed', err.message || 'Payment failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.bookId} className="checkout-summary-row">
            <span>{item.title} × {item.quantity}</span>
            <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-summary-total">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="checkout-payment">
        <h3>Payment Method</h3>
        <div className="payment-method-grid">
          {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              className={`payment-method-btn ${paymentMethod === value ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(value)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="checkout-error">{error}</p>}

      <div className="checkout-actions">
        <button type="button" className="checkout-back-btn" onClick={onBack}>
          Back to Cart
        </button>
        <button
          type="button"
          className="checkout-place-order-btn"
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? 'Processing payment...' : `Pay $${cartTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
