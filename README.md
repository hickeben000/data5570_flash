# Flash

Flash turns uploaded class materials into interactive study tools: flashcards and custom quizzes. This repo contains a Django REST backend and an Expo React Native frontend.

## What Works Now

- Token-based auth with persisted mobile sessions
- Course creation and course-specific document lists
- Document creation by pasted text or file upload
- Flashcard generation and flashcard review status updates
- Quiz generation, submission, and graded results
- Bring-your-own Gemini key flow: each user stores their key on-device and the app sends it only on AI-backed requests
- EC2 deployment scaffolding for a hosted Django backend with SQLite on the instance

## Project Layout

- `flash_backend/` Django project and API
- `flash-app/` Expo frontend with Redux Toolkit
- `deployment/` EC2, gunicorn, and nginx deployment artifacts

## Backend Setup

From the repo root:

```bash
cd flash_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
cp .env.example .env
```

Set the backend environment values in `flash_backend/.env`:

```env
SECRET_KEY=change-me
DEBUG=True
GEMINI_API_KEY=
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006,http://127.0.0.1:19006
CSRF_TRUSTED_ORIGINS=
SECURE_SSL_REDIRECT=False
REQUIRE_HTTPS_FOR_AI=False
```

Run migrations and start the API:

```bash
python manage.py migrate
python manage.py runserver
```

Useful endpoints:

- `GET /api/health/`
- `POST /api/users/register/`
- `POST /api/users/login/`
- `POST /api/documents/<id>/flashcards/`
- `POST /api/documents/<id>/quizzes/`
- `PUT /api/quizzes/<id>/submit/`

## Frontend Setup

```bash
cd flash-app
npm install
cp .env.example .env
```

Set `flash-app/.env`:

```env
API_URL=http://localhost:8000
```

Notes:

- Android emulator: use `http://10.0.2.2:8000`
- Physical device: use `http://<your-computer-lan-ip>:8000`
- The app stores the Gemini key locally on-device and sends it in `X-Gemini-Api-Key` only for AI generation/grading requests

Start Expo:

```bash
npm start
```

## Running Locally

1. Start Django in `flash_backend/`
2. Start Expo in `flash-app/`
3. Register a user in the app
4. Create a course
5. Add a document by paste or file upload
6. Save a Gemini key in Settings
7. Generate flashcards or a quiz

## Backend Tests

```bash
cd flash_backend
source .venv/bin/activate
python manage.py test core
```

## Deployment

For the hosted-backend path, see [deployment/EC2_DEPLOY.md](deployment/EC2_DEPLOY.md).

Included deployment artifacts:

- [deployment/flash.service](deployment/flash.service)
- [deployment/nginx-flash.conf](deployment/nginx-flash.conf)

## Notes On Keys And HTTPS

- BYOK is the primary model: users can use their own Gemini keys
- In production, enable HTTPS before sending live Gemini keys through the app
- Set `REQUIRE_HTTPS_FOR_AI=True` and `SECURE_SSL_REDIRECT=True` once TLS is configured
