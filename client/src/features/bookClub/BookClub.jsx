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
