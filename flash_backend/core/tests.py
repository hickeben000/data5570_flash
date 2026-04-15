from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .ai_utils import AIResponseError, generate_quiz
from .models import AnswerChoice


SAMPLE_FLASHCARDS = [
    {"front": "What is mitosis?", "back": "A process of cell division."},
    {"front": "What is ATP?", "back": "The cell's energy currency."},
]

SAMPLE_QUIZ = [
    {
        "question_type": "mc",
        "question_text": "Which organelle is the powerhouse of the cell?",
        "answer_choices": [
            {"choice_text": "Mitochondria", "is_correct": True},
            {"choice_text": "Nucleus", "is_correct": False},
            {"choice_text": "Golgi apparatus", "is_correct": False},
            {"choice_text": "Ribosome", "is_correct": False},
        ],
    },
    {
        "question_type": "fitb",
        "question_text": "DNA stands for _____ acid.",
        "answer_choices": [
            {"choice_text": "deoxyribonucleic", "is_correct": True},
        ],
    },
    {
        "question_type": "free_response",
        "question_text": "Explain why ATP matters in metabolism.",
        "answer_choices": [],
    },
]


class AuthTest(APITestCase):
    def test_register_login_and_courses_requires_token(self):
        reg = self.client.post(
            "/api/users/register/",
            {
                "username": "auth_user",
                "email": "auth@test.com",
                "password": "testpass123",
            },
            format="json",
        )
        self.assertEqual(reg.status_code, status.HTTP_201_CREATED)

        bare = self.client.get("/api/courses/")
        self.assertEqual(bare.status_code, status.HTTP_401_UNAUTHORIZED)

        login = self.client.post(
            "/api/users/login/",
            {"username": "auth_user", "password": "testpass123"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertIn("token", login.data)
        token = login.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        courses = self.client.get("/api/courses/")
        self.assertEqual(courses.status_code, status.HTTP_200_OK)


class OwnershipTest(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username="user_a", email="a@test.com", password="pass12345"
        )
        User.objects.create_user(
            username="user_b", email="b@test.com", password="pass12345"
        )

    def _login(self, username, password):
        response = self.client.post(
            "/api/users/login/",
            {"username": username, "password": password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")

    @patch("core.views.generate_quiz", return_value=SAMPLE_QUIZ)
    def test_user_b_cannot_access_user_a_resources(self, _mock_generate_quiz):
        self._login("user_a", "pass12345")
        course = self.client.post("/api/courses/", {"name": "A Course"}, format="json")
        self.assertEqual(course.status_code, status.HTTP_201_CREATED)
        course_id = course.data["id"]

        document = self.client.post(
            "/api/documents/",
            {
                "course": str(course_id),
                "title": "Doc A",
                "raw_text": "secret content",
                "source_type": "paste",
            },
            format="json",
        )
        self.assertEqual(document.status_code, status.HTTP_201_CREATED)
        document_id = document.data["id"]

        quiz = self.client.post(
            f"/api/documents/{document_id}/quizzes/",
            {
                "difficulty": "easy",
                "mc_count": 1,
                "fitb_count": 1,
                "fr_count": 1,
            },
            format="json",
            HTTP_X_GEMINI_API_KEY="test-key",
            HTTP_X_FORWARDED_PROTO="https",
        )
        self.assertEqual(quiz.status_code, status.HTTP_201_CREATED)
        quiz_id = quiz.data["id"]

        self.client.credentials()
        self._login("user_b", "pass12345")

        self.assertEqual(
            self.client.get(f"/api/courses/{course_id}/").status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.client.get(f"/api/courses/{course_id}/documents/").status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.client.post(
                "/api/documents/",
                {
                    "course": str(course_id),
                    "title": "Hijack",
                    "raw_text": "x",
                    "source_type": "paste",
                },
                format="json",
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.client.get(f"/api/quizzes/{quiz_id}/").status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.client.put(
                f"/api/quizzes/{quiz_id}/submit/",
                {"answers": {}},
                format="json",
                HTTP_X_GEMINI_API_KEY="test-key",
                HTTP_X_FORWARDED_PROTO="https",
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )


class DocumentUploadTest(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username="upload_user", email="upload@test.com", password="pass12345"
        )
        self.client.post(
            "/api/users/login/",
            {"username": "upload_user", "password": "pass12345"},
            format="json",
        )
        token = Token.objects.get(user__username="upload_user")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_create_document_from_text_and_file(self):
        course = self.client.post("/api/courses/", {"name": "Biology"}, format="json")
        self.assertEqual(course.status_code, status.HTTP_201_CREATED)
        course_id = course.data["id"]

        text_document = self.client.post(
            "/api/documents/",
            {
                "course": str(course_id),
                "title": "Chapter 1 Notes",
                "raw_text": "Cells are the basic unit of life.",
                "source_type": "paste",
            },
            format="json",
        )
        self.assertEqual(text_document.status_code, status.HTTP_201_CREATED)
        self.assertEqual(text_document.data["source_type"], "paste")

        upload = SimpleUploadedFile(
            "lecture.txt",
            b"Photosynthesis captures light energy.",
            content_type="text/plain",
        )
        file_document = self.client.post(
            "/api/documents/",
            {
                "course": str(course_id),
                "title": "Lecture Upload",
                "file": upload,
            },
            format="multipart",
        )
        self.assertEqual(file_document.status_code, status.HTTP_201_CREATED)
        self.assertEqual(file_document.data["source_type"], "upload")
        self.assertIn("Photosynthesis", file_document.data["raw_text"])


class QuizContractTest(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username="quiz_user", email="q@test.com", password="pass12345"
        )
        self.client.post(
            "/api/users/login/",
            {"username": "quiz_user", "password": "pass12345"},
            format="json",
        )
        token = Token.objects.get(user__username="quiz_user")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    @patch("core.views.grade_free_response_batch")
    @patch("core.views.generate_quiz", return_value=SAMPLE_QUIZ)
    def test_quiz_payload_hides_correct_until_submit(
        self, _mock_generate_quiz, mock_grade_free_response
    ):
        mock_grade_free_response.return_value = [
            {
                "is_correct": True,
                "feedback": "Strong explanation of ATP's role.",
                "explanation": "ATP stores and transfers energy for cell processes.",
            }
        ]

        course = self.client.post("/api/courses/", {"name": "C"}, format="json")
        self.assertEqual(course.status_code, status.HTTP_201_CREATED)

        document = self.client.post(
            "/api/documents/",
            {
                "course": str(course.data["id"]),
                "title": "D",
                "raw_text": "study material",
                "source_type": "paste",
            },
            format="json",
        )
        self.assertEqual(document.status_code, status.HTTP_201_CREATED)

        quiz_gen = self.client.post(
            f"/api/documents/{document.data['id']}/quizzes/",
            {
                "difficulty": "easy",
                "mc_count": 1,
                "fitb_count": 1,
                "fr_count": 1,
                "extra_prompt": "Focus on core terms only.",
            },
            format="json",
            HTTP_X_GEMINI_API_KEY="test-key",
            HTTP_X_FORWARDED_PROTO="https",
        )
        self.assertEqual(quiz_gen.status_code, status.HTTP_201_CREATED)
        quiz_id = quiz_gen.data["id"]

        detail = self.client.get(f"/api/quizzes/{quiz_id}/")
        self.assertEqual(detail.status_code, status.HTTP_200_OK)
        for question in detail.data["questions"]:
            for choice in question.get("answer_choices", []):
                self.assertNotIn("is_correct", choice)

        mc_question = next(
            question
            for question in detail.data["questions"]
            if question["question_type"] == "mc"
        )
        fitb_question = next(
            question
            for question in detail.data["questions"]
            if question["question_type"] == "fitb"
        )
        free_response_question = next(
            question
            for question in detail.data["questions"]
            if question["question_type"] == "free_response"
        )
        correct_mc = AnswerChoice.objects.get(
            question_id=mc_question["id"],
            is_correct=True,
        )

        submit = self.client.put(
            f"/api/quizzes/{quiz_id}/submit/",
            {
                "answers": {
                    str(mc_question["id"]): str(correct_mc.id),
                    str(fitb_question["id"]): "deoxyribonucleic",
                    str(free_response_question["id"]): "ATP moves energy around the cell.",
                }
            },
            format="json",
            HTTP_X_GEMINI_API_KEY="test-key",
            HTTP_X_FORWARDED_PROTO="https",
        )
        self.assertEqual(submit.status_code, status.HTTP_200_OK)
        self.assertEqual(submit.data["score"], 100.0)
        for question in submit.data["questions"]:
            self.assertIn("is_correct", question)
            self.assertIn("explanation", question)

        results_detail = self.client.get(f"/api/quizzes/{quiz_id}/")
        self.assertEqual(results_detail.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(results_detail.data["completed_at"])
        self.assertIn("feedback", results_detail.data["questions"][2])


class AIRequestTest(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username="ai_user", email="ai@test.com", password="pass12345"
        )
        self.client.post(
            "/api/users/login/",
            {"username": "ai_user", "password": "pass12345"},
            format="json",
        )
        token = Token.objects.get(user__username="ai_user")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
        course = self.client.post("/api/courses/", {"name": "AI"}, format="json")
        document = self.client.post(
            "/api/documents/",
            {
                "course": str(course.data["id"]),
                "title": "Notes",
                "raw_text": "Atoms are made of protons, neutrons, and electrons.",
                "source_type": "paste",
            },
            format="json",
        )
        self.document_id = document.data["id"]

    @override_settings(GEMINI_API_KEY="")
    def test_generation_requires_api_key_when_backend_default_missing(self):
        response = self.client.post(
            f"/api/documents/{self.document_id}/flashcards/",
            {"num_cards": 2},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Gemini API key", response.data["error"])


class AIUtilsValidationTest(TestCase):
    @patch("core.ai_utils._generate_json", return_value=[{"question_type": "mc"}])
    def test_generate_quiz_rejects_malformed_payload(self, _mock_generate_json):
        with self.assertRaises(AIResponseError):
            generate_quiz(
                document_text="Study text",
                difficulty="easy",
                mc_count=1,
                fitb_count=0,
                fr_count=0,
                api_key="test-key",
            )
