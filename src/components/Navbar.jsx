import React from 'react';
import { BookOpen, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <BookOpen className="nav-logo" />
        <span>OpenLibrary Hub</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        {/* Placeholder hook endpoints for future routing configurations */}
        <li><a href="#" className="disabled">My Bookshelf</a></li>
        <li><a href="#" className="disabled">Recommendation</a></li>
        <li><a href="#" className="disabled">Cart</a></li>
      </ul>
      <button className="navbar-toggle" aria-label="Toggle Navigation Menu">
        <Menu />
      </button>
    </nav>
  );
}