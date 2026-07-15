from flask import request
from app import app, limiter
from config import db
from models import Review
from routes.auth_routes import admin_required


# =========================
# GET ALL REVIEWS
# =========================
@app.route("/reviews", methods=["GET"])
def get_reviews():
    return [r.to_dict() for r in Review.query.all()]


# =========================
# GET ONE REVIEW
# =========================
@app.route("/reviews/<int:id>", methods=["GET"])
def get_review(id):
    return Review.query.get_or_404(id).to_dict()


# =========================
# CREATE REVIEW
# =========================
@app.route("/reviews", methods=["POST"])
@limiter.limit("20 per hour")
@admin_required
def create_review():
    data = request.get_json()
    review = Review(
        rating=data["rating"],
        comment=data.get("comment"),
        book_id=data["book_id"]
    )
    db.session.add(review)
    db.session.commit()
    return review.to_dict(), 201


# =========================
# UPDATE REVIEW
# =========================
@app.route("/reviews/<int:id>", methods=["PATCH"])
@limiter.limit("30 per hour")
@admin_required
def update_review(id):
    review = Review.query.get_or_404(id)
    data = request.get_json()
    review.rating = data.get("rating", review.rating)
    review.comment = data.get("comment", review.comment)
    review.book_id = data.get("book_id", review.book_id)
    db.session.commit()
    return review.to_dict()


# =========================
# DELETE REVIEW
# =========================
@app.route("/reviews/<int:id>", methods=["DELETE"])
@limiter.limit("10 per hour")
@admin_required
def delete_review(id):
    review = Review.query.get_or_404(id)
    db.session.delete(review)
    db.session.commit()
    return {}, 204