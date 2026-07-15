<<<<<<< HEAD
import { useState } from 'react';
import { X } from 'lucide-react';
import { BookClubProvider } from './context/BookClubContext.jsx';
import { useBookClub } from './context/useBookClub.js';
import BookClubCard from './components/BookClubCard.jsx';
import ReviewForm from './components/ReviewForm.jsx';
import ReviewList from './components/ReviewList.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import { useCart } from '../../context/CartContext.jsx';
import './bookclub.css';

function BookClubContent({ onToggleBookshelf, onToggleFavorite }) {
  const { books, loading, error, submittingReview, submitReview } = useBookClub();
  const { addToCart } = useCart();
  const [activeBook, setActiveBook] = useState(null);
  const [focusReview, setFocusReview] = useState(false);

  const reviewedCount = books.filter((book) => (book.reviewCount || 0) > 0).length;
  const avgRating = books.length
    ? (books.reduce((sum, book) => sum + Number(book.averageRating || 0), 0) / books.length).toFixed(1)
    : '0.0';
  const topRating = books.length
    ? Math.max(...books.map((book) => Number(book.averageRating || 0))).toFixed(1)
    : '0.0';

  const handleReadMore = (book) => {
    setActiveBook(book);
    setFocusReview(false);
  };

  const handleReview = (book) => {
    setActiveBook(book);
    setFocusReview(true);
  };

  // NOTE: Book Club books come from a separate service (bookClubService.js),
  // not from /books on your own Flask server, so book.id here may not match
  // a real Book row's id. Adding to cart only works cleanly if it does.
  const handleAddToCart = (book) => {
    addToCart(
      {
        backendId: book.id,
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        price: book.price,
      },
      1
    );
  };

  const handleSubmitReview = ({ reviewerName, comment }) => {
    if (!activeBook) return;
    submitReview(activeBook.id, {
      rating: 5,
      comment,
      reviewerName,
    });
  };

  if (loading) {
    return (
      <div className="bc-page">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bc-page">
        <div className="bc-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="bc-page">
      <div className="bc-hero">
        <p className="bc-kicker">Trending Now</p>
        <h2>Top ranked this week</h2>
        <p className="bc-hero-sub">
          Ranked by rating, review volume, recent activity, and mock popularity data.
        </p>
      </div>

      <div className="bc-stats-row">
        <div className="bc-stat-box">
          <strong>{reviewedCount}</strong>
          <span>Reviewed Books</span>
        </div>
        <div className="bc-stat-box">
          <strong>{avgRating}</strong>
          <span>Average Rating</span>
        </div>
        <div className="bc-stat-box">
          <strong>{topRating}/5</strong>
          <span>Top Rating</span>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="bc-empty">
          <h3>No Book Club books yet.</h3>
        </div>
      ) : (
        <div className="bc-grid">
          {books.map((book, index) => (
            <BookClubCard
              key={book.id}
              book={{ ...book, rank: index + 1 }}
              featured={index === 0}
              onReadMore={handleReadMore}
              onReview={handleReview}
              onToggleFavorite={onToggleFavorite}
              onToggleBookmark={onToggleBookshelf}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {activeBook && (
        <div className="bc-modal-backdrop" onClick={() => setActiveBook(null)}>
          <div className="bc-modal" onClick={(event) => event.stopPropagation()}>
            <button className="bc-modal-close" onClick={() => setActiveBook(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="bc-modal-body">
              <div className="bc-modal-book">
                <img src={activeBook.coverUrl} alt={activeBook.title} />
                <p className="bc-modal-kicker">Book Details</p>
                <h3>{activeBook.title}</h3>
                <p className="bc-modal-description">
                  {activeBook.description || 'No description is available yet.'}
                </p>

                <div className="bc-modal-facts">
                  <div>
                    <span>Author</span>
                    <strong>{activeBook.author}</strong>
                  </div>
                  <div>
                    <span>Genre</span>
                    <strong>{activeBook.genre || 'General Fiction'}</strong>
                  </div>
                  <div>
                    <span>Published</span>
                    <strong>{activeBook.publicationYear}</strong>
                  </div>
                  <div>
                    <span>Recommendation</span>
                    <strong>{activeBook.recommendationScore || 0}%</strong>
                  </div>
                </div>
              </div>

              <div className="bc-modal-reviews">
                <ReviewForm
                  bookTitle={activeBook.title}
                  submitting={submittingReview}
                  autoFocusRequest={focusReview}
                  onSubmit={handleSubmitReview}
                />
                <ReviewList reviews={activeBook.reviews} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookClub(props) {
  return (
    <BookClubProvider>
      <BookClubContent {...props} />
    </BookClubProvider>
  );
}
=======
import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import BookCard from '../books/BookCard.jsx';

export default function BookClub({
  reviewedBooks = [],
  onSelectBook,
  onToggleBookshelf,
  onToggleFavorite,
  favorites = [],
  onRateBook,
}) {
  const rankedBooks = useMemo(() => {
    return [...reviewedBooks]
      .filter((book) => Number(book.rating) > 0)
      .sort((a, b) => {
        const ratingDifference = Number(b.rating) - Number(a.rating);

        if (ratingDifference !== 0) {
          return ratingDifference;
        }

        return String(a.title).localeCompare(String(b.title));
      });
  }, [reviewedBooks]);

  const averageRating =
    rankedBooks.length > 0
      ? (
          rankedBooks.reduce((total, book) => total + Number(book.rating), 0) /
          rankedBooks.length
        ).toFixed(1)
      : '0.0';

  if (rankedBooks.length === 0) {
    return (
      <div className="empty-view-state">
        <h2>No Reviewed Books Yet</h2>
        <p>
          Add books to your bookshelf and rate them from 1 to 5 stars. Rated
          books will appear here as Book Club recommendations.
        </p>
      </div>
    );
  }

  return (
    <section className="book-club-page">
      <div className="book-club-hero">
        <div>
          <p className="book-club-kicker">Reader Recommendations</p>
          <h1>Book Club Rankings</h1>
          <p className="book-club-intro">
            Discover the most liked books based on reader star reviews. Books
            are ranked from highest rated to lowest rated.
          </p>
        </div>

        <div className="book-club-stats">
          <div className="book-club-stat-card">
            <span>{rankedBooks.length}</span>
            <small>Reviewed Books</small>
          </div>

          <div className="book-club-stat-card">
            <span>{averageRating}</span>
            <small>Average Rating</small>
          </div>

          <div className="book-club-stat-card">
            <span>{rankedBooks[0].rating}/5</span>
            <small>Top Rating</small>
          </div>
        </div>
      </div>

      <div className="book-club-section-heading">
        <h2>Most Recommended Books</h2>
        <p>Ranked by reader rating on a scale of 1 to 5 stars.</p>
      </div>

      <div className="book-grid">
        {rankedBooks.map((book, index) => (
          <div className="book-club-ranked-card" key={book.id}>
            <div className="rank-badge">#{index + 1}</div>

            <div className="review-summary">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className={Number(book.rating) >= star ? 'filled-star' : ''}
                  fill={Number(book.rating) >= star ? 'currentColor' : 'none'}
                />
              ))}
              <span>{book.rating}/5 reader rating</span>
            </div>

            <BookCard
              book={book}
              onSelect={onSelectBook}
              onToggleBookshelf={onToggleBookshelf}
              onToggleFavorite={onToggleFavorite}
              isBookshelf={true}
              isFavorite={favorites.some((favorite) => favorite.id === book.id)}
              showRating={true}
              onRateBook={onRateBook}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
>>>>>>> 5cf19a7 (Move BookClub.jsx to features/bookClub and fix BookCard import path)
