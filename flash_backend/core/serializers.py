from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
    AnswerChoice,
    Course,
    Document,
    Flashcard,
    FlashcardDeck,
    Quiz,
    QuizQuestion,
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "user", "name", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "course", "title", "raw_text", "source_type", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "deck", "front", "back", "status"]
        read_only_fields = ["id", "deck", "front", "back"]


class FlashcardDeckSerializer(serializers.ModelSerializer):
    cards = FlashcardSerializer(many=True, read_only=True)

    class Meta:
        model = FlashcardDeck
        fields = ["id", "document", "title", "created_at", "cards"]
        read_only_fields = ["id", "created_at"]


# ---------------------------------------------------------------------------
# Answer choice serializers
#
# AnswerChoiceSerializer   — used while the quiz is in progress.
#                            is_correct is intentionally excluded so the
#                            frontend never receives the answer before submission.
#
# AnswerChoiceResultSerializer — used in quiz results after submission.
#                                Includes is_correct so the frontend can
#                                highlight correct / incorrect choices.
# ---------------------------------------------------------------------------

class AnswerChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerChoice
        fields = ["id", "choice_text"]


class AnswerChoiceResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerChoice
        fields = ["id", "choice_text", "is_correct"]


# ---------------------------------------------------------------------------
# Quiz question serializers
#
# QuizQuestionSerializer       — during quiz (no answers revealed).
# QuizQuestionResultSerializer — after submission (shows grading + feedback).
# ---------------------------------------------------------------------------

class QuizQuestionSerializer(serializers.ModelSerializer):
    answer_choices = AnswerChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ["id", "question_type", "question_text", "answer_choices"]


class QuizQuestionResultSerializer(serializers.ModelSerializer):
    answer_choices = AnswerChoiceResultSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = [
            "id",
            "question_type",
            "question_text",
            "answer_choices",
            "user_answer",
            "is_correct",
            "explanation",
            "feedback",
        ]


# ---------------------------------------------------------------------------
# Quiz serializers
#
# QuizSerializer       — returned immediately after generation and during quiz.
#                        Questions shown without answers.
#
# QuizResultSerializer — returned after quiz submission.
#                        Full grading data included.
# ---------------------------------------------------------------------------

class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "document",
            "difficulty",
            "class_name",
            "learning_objectives",
            "score",
            "created_at",
            "completed_at",
            "questions",
        ]
        read_only_fields = ["id", "score", "created_at", "completed_at"]


class QuizResultSerializer(serializers.ModelSerializer):
    questions = QuizQuestionResultSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "document",
            "difficulty",
            "class_name",
            "learning_objectives",
            "score",
            "created_at",
            "completed_at",
            "questions",
        ]
        read_only_fields = ["id", "created_at"]
