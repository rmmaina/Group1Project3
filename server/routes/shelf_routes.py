from flask import request, g
from app import app
from config import db
from models import Shelf, ShelfBook, Book
from routes.auth_routes import token_required


def _get_owned_shelf(shelf_id):
    """Returns the shelf if it belongs to the current user, else None."""
    shelf = Shelf.query.get(shelf_id)
    if not shelf or shelf.user_id != g.current_user.id:
        return None
    return shelf


# =========================
# LIST / CREATE SHELVES
# =========================
@app.route("/shelves", methods=["GET"])
@token_required
def get_shelves():
    shelves = Shelf.query.filter_by(user_id=g.current_user.id).all()
    return [s.to_dict() for s in shelves]


@app.route("/shelves", methods=["POST"])
@token_required
def create_shelf():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return {"message": "Shelf name is required"}, 400

    shelf = Shelf(
        user_id=g.current_user.id,
        name=name,
        description=data.get("description"),
    )
    db.session.add(shelf)
    db.session.commit()
    return shelf.to_dict(), 201


# =========================
# LIST / ADD BOOKS ON A SHELF
# =========================
@app.route("/shelves/<int:shelf_id>/books", methods=["GET"])
@token_required
def get_shelf_books(shelf_id):
    shelf = _get_owned_shelf(shelf_id)
    if not shelf:
        return {"message": "Not authorized to view this shelf"}, 403
    return [sb.to_dict() for sb in shelf.shelf_books]


@app.route("/shelves/<int:shelf_id>/books", methods=["POST"])
@token_required
def add_shelf_book(shelf_id):
    shelf = _get_owned_shelf(shelf_id)
    if not shelf:
        return {"message": "Not authorized to modify this shelf"}, 403

    data = request.get_json() or {}
    book_id = data.get("book_id")
    book = Book.query.get(book_id)
    if not book:
        return {"message": f"Book {book_id} not found"}, 404

    existing = ShelfBook.query.filter_by(shelf_id=shelf.id, book_id=book.id).first()
    if existing:
        return existing.to_dict(), 200

    shelf_book = ShelfBook(
        shelf_id=shelf.id,
        book_id=book.id,
        status=data.get("status", "want_to_read"),
        total_pages=data.get("total_pages", book.total_pages),
    )
    db.session.add(shelf_book)
    db.session.commit()
    return shelf_book.to_dict(), 201


# =========================
# UPDATE / REMOVE A BOOK ON A SHELF
# =========================
@app.route("/shelves/<int:shelf_id>/books/<int:book_id>", methods=["PATCH"])
@token_required
def update_shelf_book(shelf_id, book_id):
    shelf = _get_owned_shelf(shelf_id)
    if not shelf:
        return {"message": "Not authorized to modify this shelf"}, 403

    shelf_book = ShelfBook.query.filter_by(shelf_id=shelf.id, book_id=book_id).first_or_404()
    data = request.get_json() or {}

    if "status" in data:
        shelf_book.status = data["status"]
    if "notes" in data:
        shelf_book.notes = data["notes"]
    if "comment" in data:
        shelf_book.comment = data["comment"]
    if "rating" in data:
        shelf_book.rating = data["rating"]

    if "total_pages" in data:
        total_pages = data["total_pages"]
        if total_pages is not None and (not isinstance(total_pages, int) or total_pages < 0):
            return {"message": "total_pages must be a non-negative integer"}, 400
        shelf_book.total_pages = total_pages

    if "current_page" in data:
        current_page = data["current_page"]
        if not isinstance(current_page, int) or current_page < 0:
            return {"message": "current_page must be a non-negative integer"}, 400
        if shelf_book.total_pages is not None and current_page > shelf_book.total_pages:
            current_page = shelf_book.total_pages
        shelf_book.current_page = current_page

        # Auto-progress status based on page count, unless the caller
        # explicitly set a status in this same request.
        if "status" not in data:
            if shelf_book.total_pages and current_page >= shelf_book.total_pages:
                shelf_book.status = "completed"
            elif current_page > 0:
                shelf_book.status = "in_progress"

    db.session.commit()
    return shelf_book.to_dict()


@app.route("/shelves/<int:shelf_id>/books/<int:book_id>", methods=["DELETE"])
@token_required
def remove_shelf_book(shelf_id, book_id):
    shelf = _get_owned_shelf(shelf_id)
    if not shelf:
        return {"message": "Not authorized to modify this shelf"}, 403

    shelf_book = ShelfBook.query.filter_by(shelf_id=shelf.id, book_id=book_id).first_or_404()
    db.session.delete(shelf_book)
    db.session.commit()
    return {}, 204