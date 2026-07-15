# 📚 OpenLibrary Hub

A full-stack book management application built with **React (Vite)**, **Flask**, and **PostgreSQL**.

Users can search thousands of books from the Open Library API, organize their personal library, save favorites, manage books, rate books through an interactive Book Club feature, track reading progress, and purchase books through a simulated cart and checkout flow.

Book Club rankings are generated from your own bookshelf's star ratings — books you've rated get ranked highest-to-lowest and surfaced as reader recommendations, with no separate/external review system involved.

---

[![Live Demo](https://img.shields.io/website?down_message=offline&label=Live%20Demo&up_message=online&url=https%3A%2F%2Fopenlibrary20.vercel.app)](https://openlibrary20.vercel.app)

# Live Demo

[https://openlibrary20.vercel.app](https://openlibrary20.vercel.app)

---

# GitHub Repository

https://github.com/rmmaina/Group1Project3

---

# Features

- Search books using the Open Library API
- View book details
- Add and remove books from your personal Bookshelf
- Save favorite books
- Track reading progress per book (current page, total pages, auto-updating status)
- Rate books in the Book Club and see reader-ranked recommendations
- Register, login, and manage your account
- Add new books
- Edit existing books
- Delete books
- Admin user management: view all users, change roles, remove accounts
- Add books to a cart with adjustable quantities
- Checkout with a choice of payment method: Debit Card, Credit Card, Visa, M-Pesa, or PayPal (simulated — no real payment processor is called)
- View past orders
- RESTful Flask API
- Rate-limited authentication endpoints to slow down brute-force attempts
- Responsive interface

---

# Technologies Used

## Frontend
- React
- JavaScript (ES6)
- CSS3
- Fetch API
- Lucide React Icons

## Backend

- Python
- Flask
- Flask-Migrate
- Flask-CORS
- Flask-Limiter
- PostgreSQL

---

# Project Structure

```
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── assets/
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── features/
│   │   │   ├── books/
│   │   │   │   ├── BookCard.jsx
│   │   │   │   ├── BookModal.jsx
│   │   │   │   ├── Bookshelf.jsx
│   │   │   │   ├── Favorites.jsx
│   │   │   │   └── progress.css
│   │   │   ├── cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   └── cart.css
│   │   │   └── bookClub/
│   │   │       ├── components/
│   │   │       │   ├── BookClubCard.jsx
│   │   │       │   ├── LoadingSkeleton.jsx
│   │   │       │   ├── ReviewForm.jsx
│   │   │       │   ├── ReviewList.jsx
│   │   │       │   └── StarRating.jsx
│   │   │       ├── context/
│   │   │       │   ├── BookClubContext.jsx
│   │   │       │   ├── bookClubContext.js
│   │   │       │   └── useBookClub.js
│   │   │       ├── data/
│   │   │       │   └── mockBookClubData.js
│   │   │       ├── services/
│   │   │       │   └── bookClubService.js
│   │   │       └── utils/
│   │   │           └── ranking.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AuthPanel.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── utils/
│   │   │   └── swal.js
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── book.py
│   │   ├── review.py
│   │   ├── user.py
│   │   ├── order.py
│   │   ├── shelf.py
│   │   └── favorite.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── book_routes.py
│   │   ├── review_routes.py
│   │   ├── order_routes.py
│   │   ├── shelf_routes.py
│   │   ├── favorite_routes.py
│   │   └── user_routes.py
│   ├── migrations/
│   ├── scripts/
│   │   └── create_admin.py
│   ├── seed.py
│   ├── requirements.txt
│   └── README.md
│
├── images/
├── README.md
└── PROJECT_PITCH.md
```

---

## Screenshots

The repository includes project screenshots in the `images/` folder. Below are the primary views captured from the app.

### Home

![Home](images/home-v2.png)
_Catalog view with search and Added/Liked status on each book._

### Manage Books (Admin)

![Manage Books](images/managebooks-v2.png)
_Admin inventory screen for adding, editing and removing titles, with a quick-add panel._

### Bookshelf

![Bookshelf](images/bookshelf-v2.png)
_Personal shelf showing your saved books and reading progress._

### Favorites

![Favorites](images/favorites-v2.png)
_Quick access to books you've marked as favorites._

### Book Club

![Book Club](images/bookclub-v2.png)
_Trending rankings based on rating, review volume, and recent activity._

### Admin Dashboard

![Admin](images/admin-v2.png)
_Admin view of the library inventory alongside the quick-add panel._

### Book Club Rankings

![Reviews](images/reviews-v2.png)
_Aggregate reader ratings and recommendation stats across the catalog._

### Writing a Review

![Review](images/review-v2.png)
_The review modal where readers post a star rating and a comment on a book._

### User View

![User](images/user-v2.png)
_The catalog as seen by a logged-in reader account._

---

# Backend Setup

## 1. Navigate to the server

```bash
cd server
```

## 2. Create a virtual environment

```bash
python -m venv venv
```

## 3. Activate the virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

This includes `Flask-Limiter`, used to rate-limit login/signup and write-heavy endpoints against abuse.

## 5. Configure the database

By default the app uses SQLite for local development:

```python
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///library.db"
```

For PostgreSQL (used in production), set the URI via an environment variable or update **app.py** directly:

```python
postgresql://username:password@localhost/library_db
```

## 6. Run migrations

```bash
export FLASK_APP=app.py
flask db upgrade
```

If migrations haven't been initialized yet in your environment:

```bash
flask db init
flask db migrate -m "initial migration"
flask db upgrade
```

Windows PowerShell:

```powershell
$env:FLASK_APP = 'app.py'
flask db migrate -m "create tables"
flask db upgrade
```

## 7. Seed the database (optional)

```bash
python seed.py
```

Note: seeded books will need `price` and `stock` values set (either in `seed.py` or via `PATCH /books/<id>`) before they can be added to a cart.

## 8. Create an admin user (optional)

An admin seeding helper is provided at `server/scripts/create_admin.py`. After migrations run:

Interactive:

```bash
python server/scripts/create_admin.py
```

Or non-interactive using environment variables:

```bash
ADMIN_USER=admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret python server/scripts/create_admin.py
```

## 9. Start the backend

```bash
python app.py
```

Backend runs on:

```
http://127.0.0.1:10000
```

---

# Frontend Setup

Navigate to the client folder.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

This project uses **Tailwind CSS v4**, wired in through the `@tailwindcss/vite` plugin (already configured in `vite.config.js` and referenced via `@import "tailwindcss";` in `index.css`). If you're setting this up somewhere fresh and see a Tailwind-related build error, confirm both packages are installed:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Start the development server.

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Books

```
GET     /books
GET     /books/<id>
POST    /books
PATCH   /books/<id>
DELETE  /books/<id>
```

Note: `POST`, `PATCH`, and `DELETE` on `/books` are protected and require an authenticated admin token. Each book now carries a `price`, `stock`, and `total_pages` field. `total_pages` is used as the default page count when the book is first added to a shelf.

## Auth

```
POST    /auth/register
POST    /auth/login
GET     /auth/me
```

- `POST /auth/register` — create a new user (returns `access_token` and `user`). Rate-limited to 3 requests/hour per IP.
- `POST /auth/login` — authenticate and receive an `access_token` and `user`. Rate-limited to 5 requests/minute per IP.
- `GET /auth/me` — return the currently authenticated user (requires `Authorization: Bearer <token>`).

## Reviews

```
GET     /reviews
GET     /reviews/<id>
POST    /reviews
PATCH   /reviews/<id>
DELETE  /reviews/<id>
```

Note: `POST`, `PATCH`, and `DELETE` on `/reviews` are protected and require an authenticated admin token.

## Shelves

```
GET     /shelves
POST    /shelves
GET     /shelves/<id>/books
POST    /shelves/<id>/books
PATCH   /shelves/<id>/books/<book_id>
DELETE  /shelves/<id>/books/<book_id>
```

All shelf endpoints require an authenticated user and only expose that user's own shelves.

Each shelf entry tracks reading progress: `current_page`, `total_pages`, and a computed `progress_percent`. Update progress via:

```json
PATCH /shelves/<id>/books/<book_id>
{ "current_page": 150, "total_pages": 300 }
```

`total_pages` defaults from the book's own `total_pages` field (set once via `POST`/`PATCH /books`) when a book is first added to a shelf, so it usually doesn't need to be re-entered per shelf. Updating `current_page` automatically flips `status` to `in_progress` or `completed` unless `status` is explicitly included in the same request.

## Favorites

```
GET     /favorites
POST    /favorites
DELETE  /favorites?external_id=<external_id>
```

Favorites are matched by an `external_id` string rather than a numeric book ID, since a book can be favorited straight from Open Library search results before it exists in the local database.

## Orders (Cart & Checkout)

```
POST    /orders
GET     /orders
GET     /orders/<id>
```

- `POST /orders` — submit a cart for checkout. Body:
  ```json
  {
    "items": [{ "book_id": 1, "quantity": 2 }],
    "payment_method": "mpesa"
  }
  ```
  Accepted `payment_method` values: `debit_card`, `credit_card`, `visa`, `mpesa`, `paypal`. Stock and totals are validated and calculated server-side. Payment is **simulated** — no real payment processor is contacted, and no real money moves. Rate-limited to 10 requests/hour per IP.
- `GET /orders` — list the authenticated user's own order history.
- `GET /orders/<id>` — view a single order (owner or admin only).

## Users

```
GET     /users
PATCH   /users/<id>
DELETE  /users/<id>
```

All `/users` endpoints require an admin token.

- `GET /users` — list every registered user.
- `PATCH /users/<id>` — update a user's `role`, `username`, or `email`. An admin cannot demote their own account away from `admin` in this call (prevents accidentally locking every admin out).
- `DELETE /users/<id>` — remove a user account. An admin cannot delete the account they're currently logged in as.

---

# Security Notes

- Passwords are hashed before storage (never stored in plain text).
- Authentication uses a signed, time-limited access token rather than resending credentials on every request.
- Write access to books, reviews, users, and shelf/order management is scoped to the authenticated user or restricted to admins where appropriate.
- Admin user management includes guard rails against self-lockout: an admin cannot demote their own account away from `admin`, and cannot delete the account they're currently logged in as.
- Login, registration, and order creation are rate-limited via Flask-Limiter to reduce abuse.
- CORS is restricted to the deployed frontend origin and local development (`localhost:5173`) rather than allowing all origins.

---

# Deployment

## Frontend

Deploy using **Vercel**.

## Backend

Deploy using **Render**.

After deploying the backend, set `VITE_API_BASE_URL` in the frontend's environment variables to point at your deployed backend, e.g.:

```
VITE_API_BASE_URL=https://your-render-app.onrender.com
```

---

# Future Improvements

- Dark mode
- Advanced search filters
- Book recommendations based on reading history (beyond current star-rating rankings)
- Real payment gateway integration (Stripe, PayPal, M-Pesa Daraja API) in place of the current simulated checkout

---

# Developers

- Robert Maina
- Joseph Ndemo
- Mark Warunge
- Gregory Kipchumba
- Rotich Ian
- Abdirahman Abdi Salah

---

# License

This project was developed for educational purposes only.

It is intended for learning and academic submission.

No commercial use is intended.