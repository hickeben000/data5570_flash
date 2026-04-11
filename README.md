# Flash

Flash turns uploaded class materials into interactive study tools: flashcards and custom quizzes. This repo contains a **Django REST** backend and an **Expo (React Native)** frontend.

## Prerequisites

- **Backend:** Python 3.12+ (3.10+ should work)
- **Frontend:** Node.js 20+ and npm (LTS recommended)
- **Mobile dev:** Expo Go on a device, or an emulator; for a physical device, the app must reach your machine’s IP (see [Environment variables](#environment-variables))

## Backend setup (new environment)

From the repository root:

```bash
cd flash_backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```

Alternatively, install only the backend file:

```bash
pip install -r requirements.txt
```

(from inside `flash_backend/` after activating the venv).

Create a `.env` file in `flash_backend/` (it is gitignored). Minimum:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
GEMINI_API_KEY=stub
```

Apply migrations and run the API:

```bash
cd flash_backend
source venv/bin/activate
python manage.py migrate
python manage.py runserver
```

The API is served at **http://127.0.0.1:8000/** with routes under **`/api/`** (for example, `POST /api/users/register/`).

## Frontend setup (new environment)

```bash
cd flash-app
npm install
```

Create `flash-app/.env` if it does not exist:

```env
API_URL=http://localhost:8000
```

- **Android emulator:** use `http://10.0.2.2:8000` instead of `localhost` so the emulator can reach the host machine.
- **Physical device on the same Wi‑Fi:** set `API_URL` to `http://<your-computer-LAN-IP>:8000` (and ensure the Django dev server listens on `0.0.0.0`, e.g. `python manage.py runserver 0.0.0.0:8000`).

Start Expo:

```bash
npm start
```

Then open in Expo Go, or run `npm run android` / `npm run ios` as needed.

## Running backend and frontend together

1. Terminal 1: activate the venv, `python manage.py runserver` (or `runserver 0.0.0.0:8000` for devices).
2. Terminal 2: `cd flash-app && npm start`.

Register a user via `POST /api/users/register/`, then log in from the app. Stub login returns a dummy token; course CRUD uses the authenticated Django user when session/basic auth is used—see the backend views for current behavior.

## Python dependencies

| Location | Purpose |
|----------|---------|
| [requirements.txt](requirements.txt) | Root file; includes [flash_backend/requirements.txt](flash_backend/requirements.txt) |
| [flash_backend/requirements.txt](flash_backend/requirements.txt) | `django`, `djangorestframework`, `django-cors-headers`, `django-environ` |

## Project layout

- `flash_backend/` — Django project `flash_backend`, app `core`, SQLite DB in dev
- `flash-app/` — Expo app, Redux Toolkit, React Navigation
