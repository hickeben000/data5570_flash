from django.conf import settings
from django.db import models


class Course(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
    )
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    SOURCE_TYPE_CHOICES = [
        ("upload", "Upload"),
        ("paste", "Paste"),
    ]

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="documents"
    )
    title = models.CharField(max_length=255)
    raw_text = models.TextField()
    source_type = models.CharField(max_length=10, choices=SOURCE_TYPE_CHOICES, default="paste")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class FlashcardDeck(models.Model):
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name="flashcard_decks"
    )
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Flashcard(models.Model):
    STATUS_CHOICES = [
        ("unseen", "Unseen"),
        ("known", "Known"),
        ("review", "Review"),
    ]

    deck = models.ForeignKey(
        FlashcardDeck, on_delete=models.CASCADE, related_name="cards"
    )
    front = models.TextField()
    back = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="unseen")

    def __str__(self):
        return self.front[:50]


class Quiz(models.Model):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name="quizzes"
    )
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Context passed to Gemini at generation time so questions are targeted.
    # class_name: e.g. "BIOL 101", learning_objectives: what the student should know.
    class_name = models.CharField(max_length=255, blank=True, default="")
    learning_objectives = models.TextField(blank=True, default="")

    class Meta:
        verbose_name_plural = "quizzes"

    def __str__(self):
        return f"Quiz ({self.difficulty}) - {self.document.title}"


class QuizQuestion(models.Model):
    QUESTION_TYPE_CHOICES = [
        ("mc", "Multiple Choice"),
        ("fitb", "Fill in the Blank"),
        ("free_response", "Free Response"),
    ]

    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="questions"
    )
    question_type = models.CharField(max_length=15, choices=QUESTION_TYPE_CHOICES)
    question_text = models.TextField()

    # For MC: stores the selected AnswerChoice ID (as string) sent by the frontend.
    # For FITB: stores the user's typed answer text.
    # For free_response: stores the user's full written response.
    user_answer = models.TextField(null=True, blank=True)

    # Null until graded. For free_response this is set by Gemini after submission.
    is_correct = models.BooleanField(null=True, blank=True)

    # Gemini's explanation shown in results for all question types.
    explanation = models.TextField(blank=True, default="")

    # Gemini's per-question feedback for free_response questions.
    # Includes what the student got right/wrong and topics to review.
    # TODO: surface struggled_topics from this field when re-generating a quiz
    #       from the same document so Gemini can focus on weak areas.
    feedback = models.TextField(blank=True, default="")

    def __str__(self):
        return self.question_text[:50]


class AnswerChoice(models.Model):
    """
    One row per answer option for a QuizQuestion.

    MC questions: 4 rows (one per option), exactly one has is_correct=True.
    FITB questions: 1 row with the correct answer text, is_correct=True.
    Free response questions: no rows — graded by Gemini after submission.
    """
    question = models.ForeignKey(
        QuizQuestion, on_delete=models.CASCADE, related_name="answer_choices"
    )
    choice_text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text[:50]
