# 📚 OpenLibrary Hub

A full-stack book management application built with **React (Vite)**, **Flask**, and **PostgreSQL**.

Users can search thousands of books from the Open Library API, organize their personal library, save favorites, manage books, and rate books through an interactive Book Club feature.

---

# Live Demo

https://openlibrary20.vercel.app/

---

# GitHub Repository

https://github.com/rmmaina/Group1Project3

---

# Features

- Search books using the Open Library API
- View book details
- Add and remove books from your personal Bookshelf
- Save favorite books
- Rate books in the Book Club
- Add new books
- Edit existing books
- Delete books
- RESTful Flask API
- Responsive interface

---
# Technologies Used

## Frontend

- JavaScript (ES6)
- CSS3
- Fetch API
- Lucide React Icons
## Backend

- Python
- Flask
- Flask Migrate
- Flask CORS
- PostgreSQL


# Project Structure

```
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── features/
│   │   │   ├── books/
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
│   │   ├── App.jsx

This project uses Flask-Migrate / Alembic. From the `server` folder run:

```bash
# set FLASK_APP if needed
export FLASK_APP=app.py
flask db migrate -m "create users and other tables"
flask db upgrade
```

Windows PowerShell:

```powershell
$env:FLASK_APP = 'app.py'
flask db migrate -m "create users and other tables"
flask db upgrade
```
│
├── server/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py

### Create an admin user (optional)

An admin seeding helper is provided at `server/scripts/create_admin.py`. After migrations run:

Interactive:

```bash
python server/scripts/create_admin.py
```

Or non-interactive using environment variables:

```bash
ADMIN_USER=admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret python server/scripts/create_admin.py
```

│   │   ├── book.py
│   │   └── review.py
│   ├── routes/
│   │   ├── book_routes.py
│   │   └── review_routes.py
│   ├── migrations/
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

![Home](images/home.png)
_Catalog view with search and featured picks._

### Manage Books (Admin)

![Manage Books](images/managebooks.png)
_Admin inventory screen for adding, editing and removing titles._

### Bookshelf

![Bookshelf](images/bookshelf.png)
_Personal shelf showing your saved books and progress._

### Favorites

![Favorites](images/favorites.png)
_Quick access to books you've marked as favorites._

### Book Club

![Book Club](images/bookclub.png)
_Community-driven reviews, rankings and discussions._

### Admin Dashboard

![Admin](images/admin.png)
_Overview for administrators: metrics and management tools._

### Reviews

![Reviews](images/reviews.png)
_Moderation and review list used by the book club._

### User Profile

![User Profile](images/user.png)
_User profile page showing account info and activity._

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

## 5. Configure PostgreSQL

Update the database URI in **app.py** or use environment variables.

Example:

```python
postgresql://username:password@localhost/library_db
```

## 6. Run migrations

```bash
flask db upgrade
```

## 7. Seed the database (optional)

```bash
python seed.py
```

## 8. Start the backend

```bash
python app.py
```

Backend runs on:

```
http://127.0.0.1:5000
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
PUT     /books/<id>
DELETE  /books/<id>
```

Note: `POST`, `PUT/PATCH`, and `DELETE` on `/books` are protected and require an authenticated admin token.

## Auth

```
POST    /auth/register
POST    /auth/login
GET     /auth/me
```

- `POST /auth/register` — create a new user (returns `access_token` and `user`).
- `POST /auth/login` — authenticate and receive an `access_token` and `user`.
- `GET /auth/me` — return the currently authenticated user (requires `Authorization: Bearer <token>`).

## Reviews

```
GET     /reviews
GET     /reviews/<id>
POST    /reviews
PUT     /reviews/<id>
DELETE  /reviews/<id>
```

Note: `POST`, `PUT/PATCH`, and `DELETE` on `/reviews` are protected and require an authenticated admin token.

---

# Deployment

## Frontend

Deploy using **Vercel**.

## Backend

Deploy using **Render**.

After deploying the backend, replace:

```javascript
http://127.0.0.1:5000/books
```

with

```javascript
https://your-render-app.onrender.com/books
```

inside **ManageBooks.jsx**.

---

# Future Improvements

- User authentication
- User accounts
- Reading progress tracker
- Dark mode
- Advanced search filters
- Book recommendations

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