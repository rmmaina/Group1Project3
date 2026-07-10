from flask import request
from app import app
from config import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from functools import wraps
from flask import request, g


serializer = URLSafeTimedSerializer(app.config.get('SECRET_KEY', 'devsecret'), salt='auth-token')


def _get_token_from_header():
    auth = request.headers.get('Authorization', '')
    if auth and auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return None


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_header()
        if not token:
            return {'message': 'Missing token'}, 401
        try:
            payload = serializer.loads(token)
            user_id = payload.get('id')
            user = User.query.get(user_id)
            if not user:
                return {'message': 'Invalid token'}, 401
            g.current_user = user
        except Exception:
            return {'message': 'Invalid or expired token'}, 401

        return f(*args, **kwargs)

    return wrapper


def admin_required(f):
    @wraps(f)
    @token_required
    def wrapper(*args, **kwargs):
        user = getattr(g, 'current_user', None)
        if not user or user.role != 'admin':
            return {'message': 'Admin privileges required'}, 403
        return f(*args, **kwargs)

    return wrapper


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return {'message': 'Missing required fields'}, 400

    existing = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing:
        return {'message': 'User with that username or email already exists'}, 400

    pw_hash = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=pw_hash)

    db.session.add(user)
    db.session.commit()

    token = serializer.dumps({'id': user.id})

    return {'access_token': token, 'user': user.to_dict()}, 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier') or data.get('username') or data.get('email')
    password = data.get('password')

    if not identifier or not password:
        return {'message': 'Missing credentials'}, 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {'message': 'Invalid username/email or password'}, 401

    token = serializer.dumps({'id': user.id})
    return {'access_token': token, 'user': user.to_dict()}
