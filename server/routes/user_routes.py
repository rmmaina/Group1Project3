from flask import request, g
from app import app
from config import db
from models import User
from routes.auth_routes import admin_required

VALID_ROLES = {"user", "admin"}


# =========================
# LIST USERS (admin only)
# =========================
@app.route("/users", methods=["GET"])
@admin_required
def get_users():
    users = User.query.all()
    return [u.to_dict() for u in users]


# =========================
# UPDATE USER ROLE (admin only)
# =========================
@app.route("/users/<int:user_id>", methods=["PATCH"])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    if "role" in data:
        new_role = data["role"]
        if new_role not in VALID_ROLES:
            return {"message": f"role must be one of: {', '.join(sorted(VALID_ROLES))}"}, 400

        # Guard rail: an admin shouldn't be able to demote themselves and
        # accidentally lock every admin out of admin-only routes.
        if user.id == g.current_user.id and new_role != "admin":
            return {"message": "You cannot remove your own admin role"}, 400

        user.role = new_role

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]

    db.session.commit()
    return user.to_dict()


# =========================
# DELETE USER (admin only)
# =========================
@app.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)

    if user.id == g.current_user.id:
        return {"message": "You cannot delete your own account while logged in as it"}, 400

    db.session.delete(user)
    db.session.commit()
    return {}, 204