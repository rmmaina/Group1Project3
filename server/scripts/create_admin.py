#!/usr/bin/env python3
import os
import getpass
from config import db
from app import app
from models import User
from werkzeug.security import generate_password_hash


def main():
    username = os.environ.get('ADMIN_USER') or input("Admin username (default: admin): ") or 'admin'
    email = os.environ.get('ADMIN_EMAIL') or input("Admin email (default: admin@example.com): ") or 'admin@example.com'
    pwd = os.environ.get('ADMIN_PASSWORD')
    if not pwd:
        pwd = getpass.getpass("Admin password: ")
    pw_hash = generate_password_hash(pwd)
    with app.app_context():
        existing = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing:
            existing.role = 'admin'
            existing.password_hash = pw_hash
            db.session.commit()
            print(f"Updated existing user {existing.username} to admin.")
        else:
            user = User(username=username, email=email, password_hash=pw_hash, role='admin')
            db.session.add(user)
            db.session.commit()
            print(f"Created admin user {username}.")


if __name__ == "__main__":
    main()
