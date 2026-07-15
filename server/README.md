# OpenLibrary Hub — Server

This is the Flask + PostgreSQL/SQLite backend for OpenLibrary Hub.

Full project documentation — setup instructions for both the backend and frontend, the complete API reference, migrations, and security notes — lives in the **root README**:

➡️ [../README.md](../README.md)

## Quick start (backend only)

```bash
python -m venv venv
source venv/Scripts/activate   # Windows (Git Bash)
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
flask db upgrade
python app.py
```

Runs at `http://127.0.0.1:10000`. See the root README for the full API endpoint list (`/auth`, `/books`, `/reviews`, `/shelves`, `/favorites`, `/orders`, `/users`).