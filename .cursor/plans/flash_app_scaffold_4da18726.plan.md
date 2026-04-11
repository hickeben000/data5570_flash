---
name: Flash App Scaffold
overview: Scaffold the full Flash application — a Django REST backend (`flash_backend/`) and an Expo React Native frontend (`flash-app/`) — with all models, serializers, viewsets, API stubs, Redux slices, navigation, and skeleton screens as specified.
todos:
  - id: backend-init
    content: Create flash_backend directory, venv, requirements.txt, django project + core app
    status: completed
  - id: backend-settings
    content: Configure settings.py with environ, CORS, DRF; create .env
    status: completed
  - id: backend-models
    content: Implement all 6 models in core/models.py with fields, FKs, and choices
    status: completed
  - id: backend-serializers
    content: Write serializers (nested for deck/quiz) in core/serializers.py
    status: completed
  - id: backend-ai-stubs
    content: Create ai_utils.py with generate_flashcards and generate_quiz stubs
    status: completed
  - id: backend-views
    content: Implement all views (ViewSets + APIViews) in core/views.py
    status: completed
  - id: backend-urls
    content: Wire up all URL routes in core/urls.py and flash_backend/urls.py
    status: completed
  - id: backend-migrate
    content: Run makemigrations + migrate, verify server starts
    status: completed
  - id: frontend-init
    content: Create Expo project, install all npm dependencies
    status: completed
  - id: frontend-store
    content: Build Redux store with all 5 slices and async thunks
    status: completed
  - id: frontend-api
    content: Create api.js with Axios instance and auth interceptor
    status: completed
  - id: frontend-navigation
    content: Set up React Navigation stack with all 9 screens
    status: completed
  - id: frontend-screens
    content: Build skeleton screens with Redux hooks and basic UI
    status: completed
  - id: frontend-card
    content: Create reusable Card component
    status: completed
  - id: frontend-env
    content: Configure .env and babel for environment variables
    status: completed
isProject: false
---

# Flash Application Scaffold Plan

## Environment

- Python 3.12.3, Node 22.22.0, npm 10.9.4, Expo SDK 55
- Repo is fresh (single commit with `README.md`)

## Directory Structure

```
flash_final/
  flash_backend/          # Django project root
    manage.py
    .env                  # SECRET_KEY, DEBUG, GEMINI_API_KEY
    requirements.txt
    flash_backend/        # Django settings package
      __init__.py
      settings.py         # django-environ, CORS, DRF config
      urls.py             # Root URL conf (includes core.urls)
      wsgi.py
    core/                 # Main Django app
      __init__.py
      models.py           # User ext not needed (use Django auth User)
      serializers.py
      views.py
      urls.py
      admin.py
      ai_utils.py         # Stub generate_flashcards / generate_quiz
  flash-app/              # Expo React Native project
    app.json
    App.js
    .env                  # API_URL=http://localhost:8000
    babel.config.js
    src/
      store/
        index.js          # configureStore
        authSlice.js
        coursesSlice.js
        documentsSlice.js
        flashcardsSlice.js
        quizzesSlice.js
      api/
        api.js            # Axios instance, base URL from env
      screens/
        LoginScreen.js
        RegisterScreen.js
        HomeScreen.js
        CourseScreen.js
        UploadScreen.js
        FlashcardScreen.js
        QuizConfigScreen.js
        QuizScreen.js
        QuizResultsScreen.js
      components/
        Card.js           # Reusable card component
      navigation/
        AppNavigator.js   # React Navigation stack
```

---

## Backend (Django + DRF)

### 1. Initialize the Django project

- Create a Python virtual environment at `flash_backend/venv`.
- Write `[flash_backend/requirements.txt](flash_backend/requirements.txt)` with: `django`, `djangorestframework`, `django-cors-headers`, `django-environ`.
- Run `django-admin startproject flash_backend .` inside the `flash_backend/` directory, then `python manage.py startapp core`.

### 2. Settings and configuration

- `[flash_backend/flash_backend/settings.py](flash_backend/flash_backend/settings.py)`:
  - Import `environ`, read `.env` for `SECRET_KEY`, `DEBUG`, `GEMINI_API_KEY`.
  - Add `rest_framework`, `corsheaders`, `core` to `INSTALLED_APPS`.
  - Add `CorsMiddleware` to `MIDDLEWARE` (before `CommonMiddleware`).
  - Set `CORS_ALLOWED_ORIGINS` to `["http://localhost:8081", "http://localhost:19006"]` (Expo dev servers).
  - DRF defaults: `DEFAULT_AUTHENTICATION_CLASSES` = `[SessionAuthentication, BasicAuthentication]`; `DEFAULT_PERMISSION_CLASSES` = `[AllowAny]` (auth is stubbed for now).
- `[flash_backend/.env](flash_backend/.env)`: `SECRET_KEY`, `DEBUG=True`, `GEMINI_API_KEY=stub`.

### 3. Models (`[flash_backend/core/models.py](flash_backend/core/models.py)`)

All models per spec. Key relationships:

- `Course.user` -> FK to `django.contrib.auth.models.User`
- `Document.course` -> FK to `Course`
- `FlashcardDeck.document` -> FK to `Document`
- `Flashcard.deck` -> FK to `FlashcardDeck`
- `Quiz.document` -> FK to `Document`
- `QuizQuestion.quiz` -> FK to `Quiz`

All `choices` fields use Django's `choices=` with tuples. `QuizQuestion.choices` is a `JSONField(null=True, blank=True)`.

### 4. Serializers (`[flash_backend/core/serializers.py](flash_backend/core/serializers.py)`)

- `UserSerializer` (for registration; writes `password` via `create_user`).
- `CourseSerializer`
- `DocumentSerializer`
- `FlashcardSerializer`
- `FlashcardDeckSerializer` — nested: includes list of `FlashcardSerializer` (read-only).
- `QuizQuestionSerializer`
- `QuizSerializer` — nested: includes list of `QuizQuestionSerializer` (read-only).

### 5. Views (`[flash_backend/core/views.py](flash_backend/core/views.py)`)


| View                      | Type           | Purpose                                                               |
| ------------------------- | -------------- | --------------------------------------------------------------------- |
| `RegisterView`            | `APIView`      | POST to create user, return 201                                       |
| `LoginView`               | `APIView`      | POST to validate credentials, return dummy token                      |
| `CourseViewSet`           | `ModelViewSet` | CRUD courses (filtered to user)                                       |
| `DocumentViewSet`         | `ModelViewSet` | CRUD documents (nested under course for list)                         |
| `GenerateFlashcardsView`  | `APIView`      | POST `/documents/:id/flashcards/` — calls stub, creates deck + cards  |
| `FlashcardDeckDetailView` | `APIView`      | GET `/flashcard-decks/:id/` — returns deck with nested cards          |
| `FlashcardUpdateView`     | `APIView`      | PUT `/flashcards/:id/` — update card status                           |
| `GenerateQuizView`        | `APIView`      | POST `/documents/:id/quizzes/` — calls stub, creates quiz + questions |
| `QuizDetailView`          | `APIView`      | GET `/quizzes/:id/` — returns quiz with nested questions              |
| `QuizSubmitView`          | `APIView`      | PUT `/quizzes/:id/submit/` — scores answers, returns result           |


### 6. URL routing (`[flash_backend/core/urls.py](flash_backend/core/urls.py)`)

Maps all endpoints from the spec table. Uses a `DefaultRouter` for `CourseViewSet` and manual `path()` entries for the APIViews and nested routes.

### 7. AI stubs (`[flash_backend/core/ai_utils.py](flash_backend/core/ai_utils.py)`)

- `generate_flashcards(document_text, num_cards=10)` — returns a list of `{"front": "...", "back": "..."}` dicts with hardcoded sample data.
- `generate_quiz(document_text, difficulty, mc_count, fitb_count, fr_count)` — returns a list of question dicts with type, text, choices (for MC), correct_answer, and explanation. All hardcoded.

### 8. Migrate and verify

- `python manage.py makemigrations core && python manage.py migrate`
- Sanity check with `python manage.py runserver`.

---

## Frontend (Expo / React Native)

### 9. Initialize the Expo project

- Run `npx create-expo-app@latest flash-app --template blank` from the repo root.
- Install dependencies:
  - `@reduxjs/toolkit react-redux`
  - `axios react-native-dotenv`
  - `@react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler`
  - `expo-document-picker` (for future file upload)

### 10. Redux store (`[flash-app/src/store/](flash-app/src/store/)`)

- `**index.js**`: `configureStore` combining all 5 slices.
- `**authSlice.js**`: state `{ user, token, loading, error }`. Thunks: `loginUser`, `registerUser`.
- `**coursesSlice.js**`: state `{ courses, loading, error }`. Thunks: `fetchCourses`, `createCourse`.
- `**documentsSlice.js**`: state `{ documents, loading, error }`. Thunks: `fetchDocuments`, `createDocument`.
- `**flashcardsSlice.js**`: state `{ deck, loading, error }`. Thunks: `generateFlashcards`, `fetchDeck`, `updateCardStatus`.
- `**quizzesSlice.js**`: state `{ quiz, loading, error }`. Thunks: `generateQuiz`, `fetchQuiz`, `submitQuiz`.

### 11. API service (`[flash-app/src/api/api.js](flash-app/src/api/api.js)`)

- Axios instance with `baseURL` from env (`API_URL`).
- Request interceptor to attach `Authorization: Token <token>` from Redux store (or AsyncStorage).

### 12. Navigation (`[flash-app/src/navigation/AppNavigator.js](flash-app/src/navigation/AppNavigator.js)`)

- Single `Stack.Navigator` with all 9 screens.
- `LoginScreen` is initial route; after login, navigate to `HomeScreen`.

### 13. Screens (skeleton with basic layout and Redux hooks)

Each screen will have:

- Proper `useSelector` / `useDispatch` hooks wired to the relevant slice.
- Basic `View` + `Text` + placeholder `Button` / `TextInput` elements.
- Navigation via `useNavigation`.

Key screen details:

- **LoginScreen / RegisterScreen**: email + password inputs, login/register buttons.
- **HomeScreen**: `FlatList` of courses, FAB to create a new course.
- **CourseScreen**: `FlatList` of documents, button to upload.
- **UploadScreen**: `TextInput` for pasting text, submit button dispatching `createDocument`.
- **FlashcardScreen**: Shows `<Card>` with flip animation toggle between front/back, "Known" / "Review" buttons.
- **QuizConfigScreen**: Pickers for difficulty + number inputs for MC/FITB/FR counts.
- **QuizScreen**: Renders questions sequentially with inputs, submit button.
- **QuizResultsScreen**: Shows score and per-question explanations.

### 14. Reusable Card component (`[flash-app/src/components/Card.js](flash-app/src/components/Card.js)`)

- Accepts `title`, `content`, `onPress`, `style` props.
- Rounded corners, shadow, padding — used for flashcard display and quiz question containers.

### 15. Environment config

- `[flash-app/.env](flash-app/.env)`: `API_URL=http://localhost:8000`
- `[flash-app/babel.config.js](flash-app/babel.config.js)`: add `module:react-native-dotenv` plugin.

---

## Execution Order

Steps 1-8 (backend) and 9-15 (frontend) are independent and will be built in parallel where possible. Within each track, the order above is sequential (models before serializers before views, store before screens, etc.).