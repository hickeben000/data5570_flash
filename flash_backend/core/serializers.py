from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
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


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            "id",
            "quiz",
            "question_type",
            "question_text",
            "choices",
            "correct_answer",
            "user_answer",
            "is_correct",
            "explanation",
        ]
        read_only_fields = ["id", "quiz", "question_type", "question_text", "choices",
                            "correct_answer", "is_correct", "explanation"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "document", "difficulty", "score", "created_at", "completed_at", "questions"]
        read_only_fields = ["id", "score", "created_at", "completed_at"]
