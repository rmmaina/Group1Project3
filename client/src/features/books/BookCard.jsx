import React, { useState } from 'react';
import { Bookmark, Heart, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function BookCard({ book, onSelect, onToggleBookshelf, onToggleFavorite, isBookshelf, isFavorite, showRating, onRateBook }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleRating = (e, ratingValue) => {
    e.stopPropagation();
    if (onRateBook) onRateBook(book.id, ratingValue);
  };

  const handleQuantityChange = (e, delta) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(book, quantity);
    setQuantity(1);
  };

  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      <div className="card-image-wrapper">
        <img src={book.coverUrl} alt={book.title} loading="lazy" />
      </div>
      <div className="card-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">By {book.author}</p>

        {/* Dynamic Star Interactive Subsystem for My Bookshelf Dashboard */}
        {showRating && (
          <div className="rating-system">
            <span className="rating-label">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${(book.rating || 0) >= star ? 'filled' : ''}`}
                onClick={(e) => handleRating(e, star)}
              >
                <Star size={16} fill={(book.rating || 0) >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        )}

        <div className="card-footer">
          <span>Published: {book.year}</span>
          {typeof book.price === 'number' && book.price > 0 && (
            <span className="book-price">${book.price.toFixed(2)}</span>
          )}
        </div>

        {/* Global Control Buttons */}
        <div className="card-actions">
          <button 
            className={`action-btn ${isBookshelf ? 'active-bookshelf' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleBookshelf(book); }}
          >
            <Bookmark size={14} fill={isBookshelf ? "currentColor" : "none"} /> 
            {isBookshelf ? 'Saved' : 'Bookshelf'}
          </button>
          
          <button 
            className={`action-btn ${isFavorite ? 'active-favorite' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(book); }}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} /> 
            {isFavorite ? 'Liked' : 'Favorite'}
          </button>
        </div>

        {/* Cart controls — only shown for real catalog books (they have a backendId) */}
        {book.backendId && (
          <div className="cart-controls" onClick={(e) => e.stopPropagation()}>
            <div className="quantity-stepper">
              <button type="button" onClick={(e) => handleQuantityChange(e, -1)}>
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={(e) => handleQuantityChange(e, 1)}>
                <Plus size={14} />
              </button>
            </div>
            <button className="action-btn add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
