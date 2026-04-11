from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai_utils import generate_flashcards, generate_quiz
from .models import (
    Course,
    Document,
    Flashcard,
    FlashcardDeck,
    Quiz,
    QuizQuestion,
)
from .serializers import (
    CourseSerializer,
    DocumentSerializer,
    FlashcardDeckSerializer,
    FlashcardSerializer,
    QuizSerializer,
    UserSerializer,
)


# ──────────────────────────── Auth ────────────────────────────


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Stub login — validates credentials and returns a dummy token."""

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({
                "token": "stub-token-replace-with-real-auth",
                "user_id": user.id,
                "username": user.username,
            })
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ──────────────────────────── Courses ─────────────────────────


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ──────────────────────────── Documents ───────────────────────


class DocumentListCreateView(APIView):
    """List documents for a course, or create a new one."""

    def get(self, request, course_id):
        documents = Document.objects.filter(course_id=course_id)
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

    def post(self, request, course_id=None):
        data = request.data.copy()
        if course_id:
            data["course"] = course_id
        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentCreateView(APIView):
    """Standalone document creation (POST /api/documents/)."""

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────── Flashcards ──────────────────────


class GenerateFlashcardsView(APIView):
    def post(self, request, document_id):
        try:
            document = Document.objects.get(pk=document_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        num_cards = request.data.get("num_cards", 10)
        card_data = generate_flashcards(document.raw_text, num_cards=int(num_cards))

        deck = FlashcardDeck.objects.create(
            document=document,
            title=f"Flashcards — {document.title}",
        )
        for card in card_data:
            Flashcard.objects.create(
                deck=deck, front=card["front"], back=card["back"]
            )

        serializer = FlashcardDeckSerializer(deck)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FlashcardDeckDetailView(APIView):
    def get(self, request, pk):
        try:
            deck = FlashcardDeck.objects.get(pk=pk)
        except FlashcardDeck.DoesNotExist:
            return Response(
                {"error": "Flashcard deck not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = FlashcardDeckSerializer(deck)
        return Response(serializer.data)


class FlashcardUpdateView(APIView):
    def put(self, request, pk):
        try:
            card = Flashcard.objects.get(pk=pk)
        except Flashcard.DoesNotExist:
            return Response(
                {"error": "Flashcard not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = FlashcardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────── Quizzes ─────────────────────────


class GenerateQuizView(APIView):
    def post(self, request, document_id):
        try:
            document = Document.objects.get(pk=document_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        difficulty = request.data.get("difficulty", "medium")
        mc_count = int(request.data.get("mc_count", 2))
        fitb_count = int(request.data.get("fitb_count", 1))
        fr_count = int(request.data.get("fr_count", 1))

        question_data = generate_quiz(
            document.raw_text, difficulty, mc_count, fitb_count, fr_count
        )

        quiz = Quiz.objects.create(document=document, difficulty=difficulty)
        for q in question_data:
            QuizQuestion.objects.create(
                quiz=quiz,
                question_type=q["question_type"],
                question_text=q["question_text"],
                choices=q["choices"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
            )

        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuizDetailView(APIView):
    def get(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)


class QuizSubmitView(APIView):
    def put(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        answers = request.data.get("answers", {})
        questions = quiz.questions.all()
        total = questions.count()
        correct_count = 0

        for question in questions:
            user_answer = answers.get(str(question.id), "")
            question.user_answer = user_answer
            is_correct = (
                user_answer.strip().lower() == question.correct_answer.strip().lower()
            )
            question.is_correct = is_correct
            question.save()
            if is_correct:
                correct_count += 1

        quiz.score = (correct_count / total * 100) if total > 0 else 0
        quiz.completed_at = timezone.now()
        quiz.save()

        serializer = QuizSerializer(quiz)
        return Response(serializer.data)
