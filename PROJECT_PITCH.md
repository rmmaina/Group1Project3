# OpenLibrary Hub - Final Project Pitch

**Team:** Robert Maina, Joseph Ndemo, Mark Warunge, Gregory Kipchumba, Rotich Ian,
Abdirahman Abdi Salah

---

## Part 1: Business Problem Scenario

### Who is our user?

Two kinds of users use this application.

Readers are people who want to discover new books, keep track of what they're reading,
save favorites, rate and review titles, and buy books, all without switching between a
notes app, a spreadsheet, and a separate bookstore tab.

Administrators are the people responsible for keeping the book catalog accurate. That
means adding new titles, fixing details, setting prices and stock, and moderating user
accounts when needed.

### What is their goal or need?

Readers want a single place to:
- search a large, real catalog of books instead of a small hand-typed list
- track what they're currently reading, including how far through a book they are
- keep favorites separate from books they're just planning to read
- see what other readers are rating highly, to help decide what to pick up next
- actually buy a book once they've decided on it, without leaving the app

Admins need a way to manage the catalog and its users without touching the database
directly.

### Why is this need important, and what happens if it's unmet?

Without a single tool, readers end up relying on scattered solutions. A sticky note for
"books to read." A separate app for ratings. A browser bookmark for buying. Every
handoff between these tools is a place where progress gets lost: a forgotten title, an
untracked page count, a favorite that never gets revisited. Reading is a habit that
depends on consistency, so that friction adds up over time and makes the habit harder
to keep.

For admins, an unmanaged catalog becomes unreliable. Prices go stale, stock counts go
untracked, and there's no way to remove a problem account. That undermines trust in the
whole platform.

### How will our app solve this need?

OpenLibrary Hub is a full-stack web application built with React, Flask, and a SQL
database. For readers, it provides:

- live search against the Open Library API for a real, large catalog
- a personal bookshelf with reading progress tracking (current page, total pages, and a
  status that updates automatically as you read)
- a favorites list kept separate from the bookshelf
- a Book Club ranking view that surfaces the reader's own highest-rated books as
  recommendations
- a cart and checkout flow with a choice of payment method (Debit Card, Credit Card,
  Visa, M-Pesa, or PayPal). Payment is simulated for this project, but the checkout flow
  is built so a real payment gateway could be substituted in later.

For admins, it provides:

- full control over the book catalog: title, author, price, stock, and page count
- a user management view to change roles or remove accounts, with safeguards so an
  admin can't accidentally lock themselves out

---

## Part 2: Problem-Solving Process

### Development stages

We broke the build into seven stages, done roughly in this order.

1. Define data models and relationships: User, Book, Review, Shelf/ShelfBook, Favorite,
   Order/OrderItem, with foreign keys tying shelf entries and orders back to both users
   and books.
2. Scaffold the Flask API with protected routes: endpoints for /auth, /books, /reviews,
   /shelves, /favorites, /orders, and /users, with admin-only routes gated separately
   from regular authenticated routes.
3. Implement user authentication using a signed, time-limited access token (via
   itsdangerous, not a session cookie or a full JWT library), issued on login and
   register, then required as a Bearer token on protected routes.
4. Build the React UI with fetches and form handling: a single-page app with
   view-based navigation rather than URL routing, a shared API client, and
   feature-scoped components for books, cart, and Book Club.
5. Add route protection and conditional rendering so admin-only views (Manage Books,
   Manage Users) stay hidden from regular readers at the component level, matching the
   backend's own role checks.
6. Test CRUD operations and the auth flow end to end, using curl against every
   endpoint (register, login, create, read, update, delete) before trusting the UI
   layer to catch problems on its own.
7. Style and finalize the UI/UX using Tailwind CSS v4, plus hand-written stylesheets
   for the cart, checkout, and reading-progress components specifically.

### Conceptual plan

```
┌─────────────────────┐        HTTPS/REST         ┌──────────────────────┐
│   React (Vite) SPA   │  ───────────────────────▶ │   Flask REST API      │
│                      │  ◀─────────────────────── │                      │
│ - Home / Catalog     │      JSON + Bearer token   │ - /auth              │
│ - Bookshelf + progress│                            │ - /books             │
│ - Favorites          │                            │ - /reviews           │
│ - Book Club rankings │                            │ - /shelves           │
│ - Cart / Checkout    │                            │ - /favorites         │
│ - Manage Books/Users │                            │ - /orders            │
└─────────────────────┘                            │ - /users             │
                                                     └──────────┬───────────┘
                                                                │ SQLAlchemy ORM
                                                                ▼
                                                     ┌──────────────────────┐
                                                     │  SQL Database         │
                                                     │  (SQLite dev /        │
                                                     │   PostgreSQL prod)    │
                                                     │  users, books,        │
                                                     │  reviews, shelves,    │
                                                     │  shelf_books,         │
                                                     │  favorites, orders,   │
                                                     │  order_items          │
                                                     └──────────────────────┘
```

Authentication method: token-based, not session-based. On login, the backend issues a
signed token (itsdangerous.URLSafeTimedSerializer) that embeds the user's ID. The
frontend stores this token in localStorage and attaches it as an Authorization Bearer
header on every request that needs identity. A token_required decorator validates the
token and loads the current user. An admin_required decorator adds a role check on top
of that.

### Anticipated challenges

Auth bugs were an expected source of trouble. Getting the token flow right on both ends
(issuing, storing, attaching, validating) matters because a missing Authorization
header looks identical to "not logged in" from the frontend's point of view, which
makes the actual cause harder to spot.

Environment drift is another concern: keeping local development (SQLite, port 10000)
and production (PostgreSQL on Render and Vercel) in sync, particularly around CORS
origins and environment variables.

Ownership logic needed care too. A shelf entry, favorite, or order should only be
readable or editable by the user who owns it, not by any logged-in user. That meant
scoping nearly every query by user ID instead of trusting a client-supplied ID.

Cross-team file integration turned out to be a real, ongoing effort rather than a
one-time setup step. With six people contributing files independently, keeping imports,
folder structure, and prop shapes consistent across components took active
coordination throughout the build.

---

## Part 3: Timeline and Scope

### Estimated time allocation

| Phase | Estimated Time |
|---|---|
| Business problem identification | 0.5 day |
| Project planning, database and model design | 1 day |
| Project planning, UI wireframing | 1 day |
| Backend implementation and auth | 3 days |
| Frontend structure and fetches | 3 days |
| UI polish and error handling | 1.5 days |
| Reflection and video creation | 0.5 day |

### Milestones

1. Seek feedback through the Project Critique, once backend and core frontend flows
   (auth, catalog, bookshelf) are functional but before final polish begins.
2. Iterate based on that feedback, incorporating notes on scope, UX clarity, or edge
   cases we missed.
3. Debug, test, and finalize: a dedicated pass across every endpoint and every UI flow
   (cart, checkout, progress tracker, admin views) before submission, confirming there
   are no console errors and no broken CRUD paths.

### Tools and topics researched before and during the project

- Flask-Migrate and Alembic, for schema migrations as the models changed over time
- Flask-Limiter, for rate limiting on sensitive endpoints
- Flask-CORS configuration, for restricting which origins are allowed
- Tailwind CSS v4's Vite plugin integration, which changed significantly from v3's
  PostCSS-based setup
- itsdangerous as a lighter alternative to a full JWT library for signing tokens
- Render and Vercel deployment workflows for the backend and frontend

This pitch reflects both what we planned going in and, now that the build is largely
done, what actually held up in practice.