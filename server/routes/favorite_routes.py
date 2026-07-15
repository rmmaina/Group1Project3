from flask import request, g
from app import app
from config import db
from models import Favorite
from routes.auth_routes import token_required


# =========================
# LIST FAVORITES
# =========================
@app.route("/favorites", methods=["GET"])
@token_required
def get_favorites():
    favorites = Favorite.query.filter_by(user_id=g.current_user.id).all()
    return [f.to_dict() for f in favorites]


# =========================
# CREATE FAVORITE
# =========================
@app.route("/favorites", methods=["POST"])
@token_required
def create_favorite():
    data = request.get_json() or {}
    external_id = data.get("external_id")
    if not external_id:
        return {"message": "external_id is required"}, 400

    existing = Favorite.query.filter_by(user_id=g.current_user.id, external_id=external_id).first()
    if existing:
        return existing.to_dict(), 200

    favorite = Favorite(
        user_id=g.current_user.id,
        external_id=external_id,
        title=data.get("title"),
        author=data.get("author"),
        cover_url=data.get("cover_url"),
    )
    db.session.add(favorite)
    db.session.commit()
    return favorite.to_dict(), 201


# =========================
# REMOVE FAVORITE
# =========================
# external_id is passed as a query param (?external_id=...) rather than a path
# segment, since Open Library keys look like "/works/OL12345W" and embedding
# a slash-containing value in a path segment gets messy across proxies/servers.
@app.route("/favorites", methods=["DELETE"])
@token_required
def remove_favorite():
    external_id = request.args.get("external_id")
    if not external_id:
        return {"message": "external_id is required"}, 400

    favorite = Favorite.query.filter_by(user_id=g.current_user.id, external_id=external_id).first_or_404()
    db.session.delete(favorite)
    db.session.commit()
    return {}, 204