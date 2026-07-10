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
- PostgreSQL database integration
- RESTful Flask API
- Responsive interface

---

# Technologies Used

## Frontend

- React (Vite)
- JavaScript (ES6)
- CSS3
- Fetch API
- Lucide React Icons

## Backend

- Python
- Flask
- Flask SQLAlchemy
- Flask Migrate
- Flask CORS
- PostgreSQL

---

# Project Structure

```
Group1Project3/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   └── books/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   ├── seed.py
│   ├── migrations/
│   ├── requirements.txt
│   └── venv/
│
├── images/
│
├── README.md
└── PROJECT_PITCH.md
```

---

# Screenshots

Add your screenshots inside the **images** folder.

Example:

```
images/
├── home.png
├── manage-books.png
├── bookshelf.png
├── favorites.png
└── bookclub.png
```

Then display them like this:

## Home

![Home](images/home.png)

## Manage Books

![Manage Books](images/manage-books.png)

## Bookshelf

![Bookshelf](images/bookshelf.png)

## Favorites

![Favorites](images/favorites.png)

## Book Club

![Book Club](images/bookclub.png)

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

## Reviews

```
GET     /reviews
GET     /reviews/<id>
POST    /reviews
PUT     /reviews/<id>
DELETE  /reviews/<id>
```

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