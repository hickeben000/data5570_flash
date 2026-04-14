import io

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai_utils import generate_flashcards, generate_quiz, grade_free_response_batch
from .models import (
    AnswerChoice,
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
    QuizResultSerializer,
    QuizSerializer,
    UserSerializer,
)


# ──────────────────────────── Helpers ─────────────────────────


def extract_text_from_file(file) -> str:
    """
    Extract plain text from an uploaded file.
    Supports: PDF, DOCX, and plain text (TXT / fallback).

    TODO (enhancement): add support for .pptx (python-pptx) and images (pytesseract OCR)
                        if students upload slides or scanned notes.
    """
    name = file.name.lower()

    if name.endswith(".pdf"):
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file.read()))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    elif name.endswith(".docx"):
        import docx
        doc = docx.Document(io.BytesIO(file.read()))
        return "\n".join(para.text for para in doc.paragraphs)

    else:
        # Fall back to reading as UTF-8 text (handles .txt and similar).
        return file.read().decode("utf-8", errors="replace")


def get_course_for_user(course_id, user):
    """404 if missing or not owned by user."""
    return get_object_or_404(Course, pk=course_id, user=user)


def get_document_for_user(document_id, user):
    """404 if missing or not owned by user (via course)."""
    return get_object_or_404(Document, pk=document_id, course__user=user)


def get_deck_for_user(pk, user):
    """404 if missing or not owned by user."""
    return get_object_or_404(FlashcardDeck, pk=pk, document__course__user=user)


def get_quiz_for_user(pk, user):
    """404 if missing or not owned by user."""
    return get_object_or_404(Quiz, pk=pk, document__course__user=user)


def get_flashcard_for_user(pk, user):
    """404 if missing or not owned by user."""
    return get_object_or_404(Flashcard, pk=pk, deck__document__course__user=user)


# ──────────────────────────── Auth ────────────────────────────


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            # get_or_create ensures repeated logins return the same token.
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return courses belonging to the authenticated user.
        return Course.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ──────────────────────────── Documents ───────────────────────


class DocumentListCreateView(APIView):
    """
    GET  /api/courses/<course_id>/documents/  — list documents in a course
    POST /api/courses/<course_id>/documents/  — create a document

    Accepts either:
      - JSON body (application/json) with a `raw_text` field (source_type="paste")
      - Multipart form (multipart/form-data) with a `file` field (source_type="upload");
        text is extracted server-side
    """
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, course_id):
        get_course_for_user(course_id, request.user)
        documents = Document.objects.filter(
            course_id=course_id, course__user=request.user
        )
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

    def post(self, request, course_id=None):
        get_course_for_user(course_id, request.user)
        data = request.data.copy()
        if course_id:
            data["course"] = course_id

        uploaded_file = request.FILES.get("file")
        if uploaded_file:
            data["raw_text"] = extract_text_from_file(uploaded_file)
            data["source_type"] = "upload"
            # Use the original filename as the title if none was provided.
            if not data.get("title"):
                data["title"] = uploaded_file.name

        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentCreateView(APIView):
    """
    POST /api/documents/ — standalone document creation (course ID in request body).
    Same file-upload handling as DocumentListCreateView.
    """
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        data = request.data.copy()
        course_pk = data.get("course")
        if course_pk is None:
            return Response(
                {"course": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        get_course_for_user(course_pk, request.user)

        uploaded_file = request.FILES.get("file")
        if uploaded_file:
            data["raw_text"] = extract_text_from_file(uploaded_file)
            data["source_type"] = "upload"
            if not data.get("title"):
                data["title"] = uploaded_file.name

        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────── Flashcards ──────────────────────


class GenerateFlashcardsView(APIView):
    def post(self, request, document_id):
        document = get_document_for_user(document_id, request.user)

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
        deck = get_deck_for_user(pk, request.user)
        serializer = FlashcardDeckSerializer(deck)
        return Response(serializer.data)


class FlashcardUpdateView(APIView):
    def put(self, request, pk):
        card = get_flashcard_for_user(pk, request.user)
        serializer = FlashcardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────── Quizzes ─────────────────────────


class GenerateQuizView(APIView):
    def post(self, request, document_id):
        document = get_document_for_user(document_id, request.user)

        difficulty = request.data.get("difficulty", "medium")
        mc_count = int(request.data.get("mc_count", 2))
        fitb_count = int(request.data.get("fitb_count", 1))
        fr_count = int(request.data.get("fr_count", 1))
        # Context fields — passed through to Gemini so questions are targeted.
        class_name = request.data.get("class_name", "")
        learning_objectives = request.data.get("learning_objectives", "")

        question_data = generate_quiz(
            document.raw_text,
            difficulty,
            mc_count,
            fitb_count,
            fr_count,
            class_name=class_name,
            learning_objectives=learning_objectives,
        )

        def coerce_bool(value):
            if isinstance(value, bool):
                return value
            if isinstance(value, int) and value in (0, 1):
                return bool(value)
            if isinstance(value, str):
                lowered = value.strip().lower()
                if lowered in ("true", "1", "yes", "y"):
                    return True
                if lowered in ("false", "0", "no", "n"):
                    return False
            return None

        sanitized_questions = []
        for q in question_data:
            if not isinstance(q, dict):
                return Response(
                    {"error": "Each question must be an object."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            qtype = q.get("question_type")
            question_text = (q.get("question_text") or "").strip()
            raw_choices = q.get("answer_choices") or []

            if qtype not in ("mc", "fitb", "free_response"):
                return Response(
                    {
                        "error": (
                            "Each question must have question_type "
                            "'mc', 'fitb', or 'free_response'."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not question_text:
                return Response(
                    {"error": "Each question must include non-empty question_text."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not isinstance(raw_choices, list):
                return Response(
                    {"error": "answer_choices must be an array."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            choices = []
            for choice in raw_choices:
                if not isinstance(choice, dict):
                    return Response(
                        {"error": "Each answer choice must be an object."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                choice_text = (choice.get("choice_text") or "").strip()
                if not choice_text:
                    return Response(
                        {"error": "Each answer choice must include non-empty choice_text."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if "is_correct" not in choice:
                    return Response(
                        {"error": "Each answer choice must include is_correct."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                is_correct = coerce_bool(choice.get("is_correct"))
                if is_correct is None:
                    return Response(
                        {"error": "is_correct must be a boolean (true/false)."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                choices.append({"choice_text": choice_text, "is_correct": is_correct})

            correct = [c for c in choices if c["is_correct"]]
            if qtype == "mc" and (len(choices) < 2 or len(correct) != 1):
                return Response(
                    {"error": "MC question must have >=2 choices and exactly one correct."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if qtype == "fitb" and (len(choices) != 1 or len(correct) != 1):
                return Response(
                    {"error": "FITB question must have exactly one choice and it must be correct."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if qtype == "free_response" and len(choices) != 0:
                return Response(
                    {"error": "Free response questions must have 0 choices."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            sanitized_questions.append({
                "question_type": qtype,
                "question_text": question_text,
                "answer_choices": choices,
            })

        # Use sanitized data (ensures is_correct is a real bool, strings are stripped, etc.)
        question_data = sanitized_questions

        quiz = Quiz.objects.create(
            document=document,
            difficulty=difficulty,
            class_name=class_name,
            learning_objectives=learning_objectives,
        )

        for q in question_data:
            question = QuizQuestion.objects.create(
                quiz=quiz,
                question_type=q["question_type"],
                question_text=q["question_text"],
            )
            # Create an AnswerChoice row for each option.
            # MC: multiple choices, one is_correct=True.
            # FITB: single choice row with the correct answer, is_correct=True.
            # Free response: no choices created here — graded by Gemini after submission.
            for choice in q.get("answer_choices", []):
                AnswerChoice.objects.create(
                    question=question,
                    choice_text=choice["choice_text"],
                    is_correct=choice["is_correct"],
                )

        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuizDetailView(APIView):
    def get(self, request, pk):
        quiz = get_quiz_for_user(pk, request.user)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)


class QuizSubmitView(APIView):
    def put(self, request, pk):
        quiz = get_quiz_for_user(pk, request.user)

        # Expected format: {"answers": {"<question_id>": "<value>"}}
        # MC:            value = AnswerChoice ID (as string), e.g. "7"
        # FITB:          value = user's typed text,           e.g. "mitosis"
        # free_response: value = user's full written answer
        answers = request.data.get("answers", {})
        questions = quiz.questions.all()
        total = questions.count()
        auto_correct = 0

        free_response_questions = []

        for question in questions:
            user_answer = answers.get(str(question.id), "")
            question.user_answer = user_answer

            if question.question_type == "mc":
                # Look up the chosen AnswerChoice and check its is_correct flag.
                try:
                    chosen = question.answer_choices.get(id=int(user_answer))
                    question.is_correct = chosen.is_correct
                except (AnswerChoice.DoesNotExist, ValueError, TypeError):
                    question.is_correct = False
                if question.is_correct:
                    auto_correct += 1
                question.save()

            elif question.question_type == "fitb":
                # Compare typed answer to the correct AnswerChoice text (case-insensitive).
                correct_choice = question.answer_choices.filter(is_correct=True).first()
                if correct_choice:
                    question.is_correct = (
                        user_answer.strip().lower()
                        == correct_choice.choice_text.strip().lower()
                    )
                else:
                    question.is_correct = False
                if question.is_correct:
                    auto_correct += 1
                question.save()

            elif question.question_type == "free_response":
                # Free response is graded by Gemini after collecting all answers.
                # Save the answer now; is_correct/feedback set below.
                question.save()
                free_response_questions.append(question)

        # ── Gemini grading for free response ──────────────────────────────
        # TODO (Gemini): grade_free_response_batch is currently a stub.
        #   When implemented it will call Gemini once with all FR questions
        #   and return per-question {is_correct, feedback, explanation}.
        #   The feedback will include what the student struggled with so it
        #   can be fed back as context when re-generating a quiz from the
        #   same document (see generate_quiz in ai_utils.py).
        if free_response_questions:
            results = grade_free_response_batch(
                free_response_questions,
                document_text=quiz.document.raw_text,
                class_name=quiz.class_name,
                learning_objectives=quiz.learning_objectives,
            )
            for question, result in zip(free_response_questions, results):
                question.is_correct = result.get("is_correct", False)
                question.feedback = result.get("feedback", "")
                question.explanation = result.get("explanation", "")
                question.save()
                if question.is_correct:
                    auto_correct += 1

        quiz.score = (auto_correct / total * 100) if total > 0 else 0
        quiz.completed_at = timezone.now()
        quiz.save()

        # Return the full result serializer so the frontend gets graded answers.
        serializer = QuizResultSerializer(quiz)
        return Response(serializer.data)
