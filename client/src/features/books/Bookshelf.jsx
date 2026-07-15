import React, { useState } from 'react';
import BookCard from './BookCard.jsx';
import './progress.css';

function ProgressTracker({ book, onProgressChange, onPageProgressChange }) {
  const [currentPage, setCurrentPage] = useState(book.current_page ?? 0);
  const [totalPages, setTotalPages] = useState(book.total_pages ?? '');

  const percent = book.progress_percent ?? 0;

  const handleSave = (event) => {
    event.preventDefault();
    const parsedCurrent = Math.max(0, parseInt(currentPage, 10) || 0);
    const parsedTotal = totalPages === '' ? null : Math.max(0, parseInt(totalPages, 10) || 0);
    onPageProgressChange(book.id, parsedCurrent, parsedTotal);
  };

  return (
    <div className="progress-tracker">
      <div className="progress-bar-track">
        <div className="progress-bar-value" style={{ width: `${percent}%` }} />
      </div>

      <div className="progress-tracker-row">
        <span className="progress-tracker-percent">{percent}% complete</span>
        <select
          className="progress-status-select"
          value={book.status || 'want_to_read'}
          onChange={(event) => onProgressChange(book.id, event.target.value)}
        >
          <option value="want_to_read">Want to read</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <form className="progress-page-form" onSubmit={handleSave}>
        <input
          type="number"
          min="0"
          className="progress-page-input"
          placeholder="Page"
          value={currentPage}
          onChange={(event) => setCurrentPage(event.target.value)}
        />
        <span className="progress-of">of</span>
        <input
          type="number"
          min="0"
          className="progress-page-input"
          placeholder="Total pages"
          value={totalPages}
          onChange={(event) => setTotalPages(event.target.value)}
        />
        <button type="submit" className="progress-save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default function Bookshelf({
  shelfBooks,
  onSelectBook,
  onToggleBookshelf,
  onToggleFavorite,
  favorites,
  onRateBook,
  onProgressChange,
  onPageProgressChange,
}) {
  if (shelfBooks.length === 0) {
    return (
      <div className="empty-view-state">
        <h2>Your Bookshelf is Empty</h2>
        <p>Return to the main library catalog page to track books you want to read.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', letterSpacing: '-0.02em' }}>My Personal Tracker Bookshelf</h2>
      <div className="book-grid">
        {shelfBooks.map((book) => (
          <div key={book.id} className="shelf-book-entry">
            <BookCard
              book={book}
              onSelect={onSelectBook}
              onToggleBookshelf={onToggleBookshelf}
              onToggleFavorite={onToggleFavorite}
              isBookshelf={true}
              isFavorite={favorites.some((f) => f.id === book.id)}
              showRating={true}
              onRateBook={onRateBook}
            />
            {onProgressChange && onPageProgressChange && (
              <ProgressTracker
                book={book}
                onProgressChange={onProgressChange}
                onPageProgressChange={onPageProgressChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
