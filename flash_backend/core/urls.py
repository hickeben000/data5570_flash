from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"courses", views.CourseViewSet, basename="course")

urlpatterns = [
    path("users/register/", views.RegisterView.as_view(), name="register"),
    path("users/login/", views.LoginView.as_view(), name="login"),

    path("", include(router.urls)),

    path(
        "courses/<int:course_id>/documents/",
        views.DocumentListCreateView.as_view(),
        name="course-documents",
    ),
    path("documents/", views.DocumentCreateView.as_view(), name="document-create"),

    path(
        "documents/<int:document_id>/flashcards/",
        views.GenerateFlashcardsView.as_view(),
        name="generate-flashcards",
    ),
    path(
        "flashcard-decks/<int:pk>/",
        views.FlashcardDeckDetailView.as_view(),
        name="flashcard-deck-detail",
    ),
    path(
        "flashcards/<int:pk>/",
        views.FlashcardUpdateView.as_view(),
        name="flashcard-update",
    ),

    path(
        "documents/<int:document_id>/quizzes/",
        views.GenerateQuizView.as_view(),
        name="generate-quiz",
    ),
    path("quizzes/<int:pk>/", views.QuizDetailView.as_view(), name="quiz-detail"),
    path(
        "quizzes/<int:pk>/submit/",
        views.QuizSubmitView.as_view(),
        name="quiz-submit",
    ),
]
