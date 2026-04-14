from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import AnswerChoice


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
        r = self.client.post(
            "/api/users/login/",
            {"username": username, "password": password},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {r.data['token']}")

    def test_user_b_cannot_access_user_a_resources(self):
        self._login("user_a", "pass12345")
        c = self.client.post("/api/courses/", {"name": "A Course"}, format="json")
        self.assertEqual(c.status_code, status.HTTP_201_CREATED)
        course_id = c.data["id"]

        d = self.client.post(
            "/api/documents/",
            {
                "course": str(course_id),
                "title": "Doc A",
                "raw_text": "secret content",
                "source_type": "paste",
            },
            format="multipart",
        )
        self.assertEqual(d.status_code, status.HTTP_201_CREATED)
        doc_id = d.data["id"]

        qgen = self.client.post(
            f"/api/documents/{doc_id}/quizzes/",
            {
                "difficulty": "easy",
                "mc_count": 1,
                "fitb_count": 0,
                "fr_count": 0,
            },
            format="json",
        )
        self.assertEqual(qgen.status_code, status.HTTP_201_CREATED)
        quiz_id = qgen.data["id"]

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
                format="multipart",
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
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )


class QuizContractTest(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username="quiz_user", email="q@test.com", password="pass12345"
        )

    def test_quiz_payload_hides_correct_until_submit(self):
        self.client.post(
            "/api/users/login/",
            {"username": "quiz_user", "password": "pass12345"},
            format="json",
        )
        token = Token.objects.get(user__username="quiz_user")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        c = self.client.post("/api/courses/", {"name": "C"}, format="json")
        self.assertEqual(c.status_code, status.HTTP_201_CREATED)

        d = self.client.post(
            "/api/documents/",
            {
                "course": str(c.data["id"]),
                "title": "D",
                "raw_text": "study material",
                "source_type": "paste",
            },
            format="json",
        )
        self.assertEqual(d.status_code, status.HTTP_201_CREATED)

        qgen = self.client.post(
            f"/api/documents/{d.data['id']}/quizzes/",
            {
                "difficulty": "easy",
                "mc_count": 1,
                "fitb_count": 1,
                "fr_count": 0,
            },
            format="json",
        )
        self.assertEqual(qgen.status_code, status.HTTP_201_CREATED)
        quiz_id = qgen.data["id"]

        detail = self.client.get(f"/api/quizzes/{quiz_id}/")
        self.assertEqual(detail.status_code, status.HTTP_200_OK)
        for question in detail.data["questions"]:
            for choice in question.get("answer_choices", []):
                self.assertNotIn("is_correct", choice)

        mc_q = next(q for q in detail.data["questions"] if q["question_type"] == "mc")
        fitb_q = next(
            q for q in detail.data["questions"] if q["question_type"] == "fitb"
        )
        correct_mc = AnswerChoice.objects.get(
            question_id=mc_q["id"],
            is_correct=True,
        )

        submit = self.client.put(
            f"/api/quizzes/{quiz_id}/submit/",
            {
                "answers": {
                    str(mc_q["id"]): str(correct_mc.id),
                    str(fitb_q["id"]): "answer",
                }
            },
            format="json",
        )
        self.assertEqual(submit.status_code, status.HTTP_200_OK)
        self.assertIn("score", submit.data)
        self.assertEqual(submit.data["score"], 100.0)
        for question in submit.data["questions"]:
            self.assertIn("is_correct", question)
            self.assertTrue(question["is_correct"])
