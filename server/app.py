from flask import Flask
from flask_cors import CORS
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
CORS(app)

# =========================
# IMPORT MODELS (IMPORTANT)
# =========================
from models import Book, Review

# =========================
# IMPORT ROUTES
# =========================
from routes.book_routes import *
from routes.review_routes import *
from routes.auth_routes import *

# =========================
# RUN APP (RENDER READY)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)