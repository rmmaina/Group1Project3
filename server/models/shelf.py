from config import db


class Shelf(db.Model):
    __tablename__ = "shelves"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    shelf_books = db.relationship(
        "ShelfBook",
        back_populates="shelf",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
        }


class ShelfBook(db.Model):
    __tablename__ = "shelf_books"

    id = db.Column(db.Integer, primary_key=True)
    shelf_id = db.Column(db.Integer, db.ForeignKey("shelves.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="want_to_read")
    notes = db.Column(db.Text)
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    current_page = db.Column(db.Integer, nullable=False, default=0)
    total_pages = db.Column(db.Integer)

    shelf = db.relationship("Shelf", back_populates="shelf_books")
    book = db.relationship("Book")

    def to_dict(self):
        # Shaped to look like a "book with shelf info attached" so the
        # frontend's normalizeBook() can treat it the same as a catalog book.
        book = self.book

        progress_percent = 0
        if self.total_pages and self.total_pages > 0:
            progress_percent = round(min(self.current_page / self.total_pages, 1) * 100)

        return {
            "id": book.id if book else self.id,
            "shelf_book_id": self.id,
            "title": book.title if book else None,
            "author": book.author if book else None,
            "genre": book.genre if book else None,
            "description": book.description if book else None,
            "price": book.price if book else None,
            "stock": book.stock if book else None,
            "status": self.status,
            "notes": self.notes,
            "comment": self.comment,
            "rating": self.rating,
            "current_page": self.current_page,
            "total_pages": self.total_pages,
            "progress_percent": progress_percent,
        }