from flask import Flask
from flask_cors import CORS
from config import db, migrate
import os

app = Flask(__name__)

# security
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')

# =========================
# DATABASE CONFIG (FIXED FOR DEPLOYMENT)
# =========================
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///library.db"
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