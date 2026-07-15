from config import db

class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50))
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False, default=0.0)
    stock = db.Column(db.Integer, nullable=False, default=0)
    total_pages = db.Column(db.Integer)

    reviews = db.relationship(
        "Review",
        back_populates="book",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "total_pages": self.total_pages,
            "reviews": [r.to_dict() for r in self.reviews]
        }