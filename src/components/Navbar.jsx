import React from 'react';
import { Menu } from 'lucide-react';
import icon1 from '../assets/icon1.png'; // adjust path if needed

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src={icon1}
          alt="Open Library Hub Logo"
          className="nav-logo"
        />
        <span>Open Library Hub</span>
      </div>

      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#" className="disabled">My Bookshelf</a></li>
        <li><a href="#" className="disabled">Recommendation</a></li>
        <li><a href="#" className="disabled">Cart</a></li>
      </ul>

      <button
        className="navbar-toggle"
        aria-label="Toggle Navigation Menu"
      >
        <Menu />
      </button>
    </nav>
  );
}