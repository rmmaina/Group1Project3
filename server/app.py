from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import db, migrate
import os

app = Flask(__name__)

# security
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')

# =========================
# DATABASE CONFIG (POSTGRESQL)
# =========================
database_url = os.environ.get(
    "DATABASE_URL",
    "postgresql://username:password@localhost/library_db"
)

# Render/Heroku-style URLs sometimes use "postgres://" which SQLAlchemy
# no longer accepts; normalize to "postgresql://"
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# =========================
# INIT EXTENSIONS
# =========================
db.init_app(app)
migrate.init_app(app, db)

# Enable CORS for frontend (Vercel)
CORS(app, origins=[
    "https://openlibrary20.vercel.app",
    "http://localhost:5173",
])

# =========================
# RATE LIMITING
# =========================
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(message=str(e.description)), 429


# =========================
# IMPORT MODELS (IMPORTANT)
# =========================
from models import Book, Review, Order, OrderItem, Shelf, ShelfBook, Favorite

# =========================
# IMPORT ROUTES
# =========================
from routes.book_routes import *
from routes.review_routes import *
from routes.auth_routes import *
from routes.order_routes import *
from routes.shelf_routes import *
from routes.favorite_routes import *
from routes.user_routes import *

# =========================
# RUN APP (RENDER READY)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)