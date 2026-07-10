import React from "react";

export default function Navbar({ currentView, onViewChange }) {
  return (
    <nav className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">
        <img src="/logo.png" alt="logo" className="logo" />
        <span className="brand">OpenLibrary Hub</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        <button
          className={currentView === "home" ? "active" : ""}
          onClick={() => onViewChange("home")}
        >
          Home
        </button>

        <button
          className={currentView === "manageBooks" ? "active" : ""}
          onClick={() => onViewChange("manageBooks")}
        >
          Manage Books
        </button>

        <button
          className={currentView === "bookshelf" ? "active" : ""}
          onClick={() => onViewChange("bookshelf")}
        >
          Bookshelf
        </button>

        <button
          className={currentView === "bookClub" ? "active" : ""}
          onClick={() => onViewChange("bookClub")}
        >
          Book Club
        </button>

        <button
          className={currentView === "favorites" ? "active" : ""}
          onClick={() => onViewChange("favorites")}
        >
          Favorites
        </button>

      </div>
    </nav>
  );
}