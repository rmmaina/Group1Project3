import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/books";

export default function ManageBooks() {
  const emptyForm = {
    title: "",
    author: "",
    year: "",
    publisher: "",
    coverImage: "",
    notes: "",
  };

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load books
  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle input change
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add or update book
  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setForm(emptyForm);
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  // Edit
  function handleEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      year: book.year || "",
      publisher: book.publisher || "",
      coverImage: book.coverImage || "",
      notes: book.notes || "",
    });
  }

  // Delete
  async function handleDelete(id) {
    if (!window.confirm("Delete this book?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchBooks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="manage-books-layout">
      {/* LEFT: FORM */}
      <div className="manage-books-form-card">
        <div className="form-header">
          <p className="quick-add">QUICK ADD</p>
          <h2>Add a book</h2>
          <span className="badge">{editingId ? "Edit" : "New"}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            name="title"
            placeholder="Enter the title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Author</label>
          <input
            name="author"
            placeholder="Who wrote it?"
            value={form.author}
            onChange={handleChange}
            required
          />

          <label>First Published</label>
          <input
            name="year"
            placeholder="Year or edition"
            value={form.year}
            onChange={handleChange}
          />

          <label>Publisher</label>
          <input
            name="publisher"
            placeholder="Publisher name"
            value={form.publisher}
            onChange={handleChange}
          />

          <label>Cover Image URL</label>
          <input
            name="coverImage"
            placeholder="https://example.com/cover.jpg"
            value={form.coverImage}
            onChange={handleChange}
          />

          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Add a quick note or reading reminder"
            value={form.notes}
            onChange={handleChange}
          />

          <button className="save-btn" type="submit">
            Save book
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* RIGHT: LIST */}
      <div className="manage-books-list">
        <h2>Your Books</h2>

        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>No books yet</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                {book.coverImage && (
                  <img src={book.coverImage} alt={book.title} />
                )}

                <h3>{book.title}</h3>
                <p>{book.author}</p>

                <small>{book.year}</small>

                <p className="notes">{book.notes}</p>

                <div className="actions">
                  <button onClick={() => handleEdit(book)}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}