from flask import request, g
from app import app
from config import db
from models import Book
from routes.auth_routes import token_required, admin_required


# =========================
# GET ALL BOOKS
# =========================
@app.route("/books", methods=["GET"])
def get_books():
    return [b.to_dict() for b in Book.query.all()]


# =========================
# GET ONE BOOK
# =========================
@app.route("/books/<int:id>", methods=["GET"])
def get_book(id):
    return Book.query.get_or_404(id).to_dict()


# =========================
# CREATE BOOK
# =========================
@app.route("/books", methods=["POST"])
@admin_required
def create_book():
    data = request.get_json()

    book = Book(
        title=data["title"],
        author=data["author"],
        genre=data.get("genre"),
        description=data.get("description")
    )

    db.session.add(book)
    db.session.commit()

    return book.to_dict(), 201


# =========================
# UPDATE BOOK
# =========================
@app.route("/books/<int:id>", methods=["PATCH"])
@admin_required
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.get_json()

    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.genre = data.get("genre", book.genre)
    book.description = data.get("description", book.description)

    db.session.commit()
    return book.to_dict()


# =========================
# DELETE BOOK
# =========================
@app.route("/books/<int:id>", methods=["DELETE"])
@admin_required
def delete_book(id):
    book = Book.query.get_or_404(id)

    db.session.delete(book)
    db.session.commit()

    return {}, 204