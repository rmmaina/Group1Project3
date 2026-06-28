// Updated frontend documentation

import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BookGrid from "./features/books/BookGrid.jsx";
import BookModal from "./features/books/BookModal.jsx";
import Bookshelf from "./features/books/Bookshelf.jsx";
import Favorites from "./features/books/Favorites.jsx";
import { fetchBooks } from "./features/books/bookService.js";
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from "./features/books/BookCard.jsx";
import BookClub from "./features/books/BookClub.jsx";

export default function App() {
  // Navigation Architecture State Hooks
  const [view, setView] = useState('home'); 

  // Persistent User Data Pools
  const [bookshelf, setBookshelf] = useState(() => {
    const saved = localStorage.getItem('lib_bookshelf');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lib_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Base API Pipeline Core Hook State Variables
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync mutations to LocalStorage Layers automatically
  useEffect(() => {
    localStorage.setItem('lib_bookshelf', JSON.stringify(bookshelf));
  }, [bookshelf]);

  useEffect(() => {
    localStorage.setItem('lib_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Debounce API dispatch hooks
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedTerm(searchTerm); setPage(1); }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Network Fetching Engine Call
  useEffect(() => {
    let isMounted = true;
    if (view !== 'home') return; // Suspend background query operations on static panels

    async function loadLibraryData() {
      const cleanQuery = debouncedTerm.trim().toLowerCase();
      if (cleanQuery.length > 0 && cleanQuery.length < 3) return;

      try {
        setLoading(true);
        setError(null);
        const query = cleanQuery || 'classic literature';
        const data = await fetchBooks(query, page);
        if (isMounted) {
          setBooks(data.books);
          setTotalResults(data.totalResults);
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch book indices from the Open Library network API.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLibraryData();
    return () => { isMounted = false; };
  }, [debouncedTerm, page, view]);

  // Action Mutators
  const toggleBookshelf = (clickedBook) => {
    setBookshelf(prev => {
      const exists = prev.some(b => b.id === clickedBook.id);
      if (exists) return prev.filter(b => b.id !== clickedBook.id);
      return [...prev, { ...clickedBook, rating: 0 }];
    });
  };

  const toggleFavorite = (clickedBook) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === clickedBook.id);
      if (exists) return prev.filter(f => f.id !== clickedBook.id);
      return [...prev, clickedBook];
    });
  };

  const handleRateBook = (bookId, newRating) => {
    setBookshelf(prev => prev.map(b => b.id === bookId ? { ...b, rating: newRating } : b));
  };

  const totalPages = Math.min(Math.ceil(totalResults / 30), 100);

  return (
    <div className="app-container">
      <Navbar currentView={view} onViewChange={setView} />
      
      <main>
        {view === 'home' && (
          <>
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search thousands of books across global archives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading && (
              <div className="loading-box">
                <span className="loading-text">Querying open library records...</span>
                <div className="progress-track"><div className="progress-bar-fill"></div></div>
              </div>
            )}
            
            {error && <div className="status-message error-message">{error}</div>}
            
            {!loading && !error && (
              books.length > 0 ? (
                <>
                  <div className="book-grid">
                    {books.map(book => (
                      <BookCard 
                        key={book.id}
                        book={book}
                        onSelect={setSelectedBook}
                        onToggleBookshelf={toggleBookshelf}
                        onToggleFavorite={toggleFavorite}
                        isBookshelf={bookshelf.some(b => b.id === book.id)}
                        isFavorite={favorites.some(f => f.id === book.id)}
                        showRating={bookshelf.some(b => b.id === book.id)}
                        onRateBook={handleRateBook}
                      />
                    ))}
                  </div>
                  
                  <div className="pagination-container">
                    <button className="pagination-btn" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                      <ChevronLeft size={18} /> Previous
                    </button>
                    <span className="pagination-info">Page <strong>{page}</strong> of {totalPages || 1}</span>
                    <button className="pagination-btn" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}>
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-results"><h3>No match records uncovered</h3></div>
              )
            )}
          </>
        )}

        {view === 'bookshelf' && (
          <Bookshelf 
            shelfBooks={bookshelf}
            onSelectBook={setSelectedBook}
            onToggleBookshelf={toggleBookshelf}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            onRateBook={handleRateBook}
          />
        )}

        {view === 'favorites' && (
          <Favorites 
            favoriteBooks={favorites}
            onSelectBook={setSelectedBook}
            onToggleBookshelf={toggleBookshelf}
            onToggleFavorite={toggleFavorite}
            bookshelf={bookshelf}
          />
        )}

        {view === 'bookClub' && (
          <BookClub
            reviewedBooks={bookshelf}
            onSelectBook={setSelectedBook}
            onToggleBookshelf={toggleBookshelf}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            onRateBook={handleRateBook}
          />
        )}
      </main>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      <Footer />
    </div>
  );
}