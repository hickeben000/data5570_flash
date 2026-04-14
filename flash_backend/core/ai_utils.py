"""
AI utility functions powered by Google Gemini.

All functions currently return stub data so the rest of the app can be
developed and tested without a live API key.

TODO (Gemini): When ready to go live:
  1. pip install google-generativeai (already in requirements.txt)
  2. Set GEMINI_API_KEY in flash_backend/.env
  3. Uncomment the genai lines in each function and remove the stub returns.
  4. Run the app and verify the response shapes match what the views expect.

Expected env var: GEMINI_API_KEY (loaded in settings.py as settings.GEMINI_API_KEY)
"""

# import google.generativeai as genai
# from django.conf import settings
# genai.configure(api_key=settings.GEMINI_API_KEY)


# ──────────────────────────── Flashcards ──────────────────────


def generate_flashcards(document_text: str, num_cards: int = 10) -> list[dict]:
    """
    Generate flashcards from document text.

    Returns a list of dicts:
        [{"front": "<question>", "back": "<answer>"}, ...]

    TODO (Gemini): Replace stub with something like:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            f"Generate exactly {num_cards} flashcards from the text below. "
            "Return a JSON array where each item has 'front' (a question) "
            "and 'back' (the answer). Return only the JSON array, no extra text.\n\n"
            f"{document_text}"
        )
        response = model.generate_content(prompt)
        return json.loads(response.text)
    """
    # ── STUB ────────────────────────────────────────────────────────────────
    return [
        {
            "front": f"Sample question {i} from the document?",
            "back": f"Sample answer {i} — will be AI-generated from your content.",
        }
        for i in range(1, num_cards + 1)
    ]
    # ── END STUB ─────────────────────────────────────────────────────────────


# ──────────────────────────── Quiz generation ─────────────────


def generate_quiz(
    document_text: str,
    difficulty: str,
    mc_count: int = 2,
    fitb_count: int = 1,
    fr_count: int = 1,
    class_name: str = "",
    learning_objectives: str = "",
) -> list[dict]:
    """
    Generate quiz questions from document text.

    Returns a list of dicts with this shape:
        {
            "question_type": "mc" | "fitb" | "free_response",
            "question_text": "<the question>",
            "answer_choices": [
                {"choice_text": "<option>", "is_correct": True | False},
                ...
            ]
            # free_response questions have answer_choices = []
        }

    MC questions:   4 answer_choices, exactly one is_correct=True.
    FITB questions: 1 answer_choice with the correct fill-in word/phrase, is_correct=True.
    FR questions:   answer_choices is empty — graded by Gemini after submission.

    TODO (Gemini): Replace stub with something like:
        model = genai.GenerativeModel("gemini-1.5-flash")
        context_block = ""
        if class_name:
            context_block += f"Class: {class_name}\n"
        if learning_objectives:
            context_block += f"Learning objectives: {learning_objectives}\n"

        prompt = (
            f"{context_block}"
            f"Difficulty: {difficulty}\n\n"
            f"Using the text below, generate:\n"
            f"  - {mc_count} multiple-choice questions (4 options each, mark the correct one)\n"
            f"  - {fitb_count} fill-in-the-blank questions (provide the correct word/phrase)\n"
            f"  - {fr_count} free-response questions (no answer needed)\n\n"
            "Return a JSON array. Each item must have:\n"
            "  question_type: 'mc' | 'fitb' | 'free_response'\n"
            "  question_text: string\n"
            "  answer_choices: array of {choice_text: string, is_correct: bool}\n"
            "    (empty array for free_response)\n"
            "Return only the JSON array.\n\n"
            f"{document_text}"
        )
        response = model.generate_content(prompt)
        return json.loads(response.text)
    """
    # ── STUB ────────────────────────────────────────────────────────────────
    questions = []

    for i in range(1, mc_count + 1):
        questions.append({
            "question_type": "mc",
            "question_text": f"Sample multiple choice question {i}?",
            "answer_choices": [
                {"choice_text": "Option A — correct answer", "is_correct": True},
                {"choice_text": "Option B", "is_correct": False},
                {"choice_text": "Option C", "is_correct": False},
                {"choice_text": "Option D", "is_correct": False},
            ],
        })

    for i in range(1, fitb_count + 1):
        questions.append({
            "question_type": "fitb",
            "question_text": f"The _____ is the sample fill-in-the-blank answer {i}.",
            "answer_choices": [
                {"choice_text": "answer", "is_correct": True},
            ],
        })

    for i in range(1, fr_count + 1):
        questions.append({
            "question_type": "free_response",
            "question_text": f"Explain the concept in sample free response question {i}.",
            "answer_choices": [],  # No pre-stored answer; Gemini grades after submission.
        })

    return questions
    # ── END STUB ─────────────────────────────────────────────────────────────


# ──────────────────────────── Free response grading ───────────


def grade_free_response_batch(
    questions,
    document_text: str = "",
    class_name: str = "",
    learning_objectives: str = "",
) -> list[dict]:
    """
    Grade a list of free-response QuizQuestion objects using Gemini.

    `questions` is a list of QuizQuestion model instances that already have
    `user_answer` saved on them.

    Returns a list of dicts (same order as input questions):
        {
            "is_correct": bool,    # True if the answer was satisfactory
            "feedback":   str,     # Personalised feedback for the student, including
                                   # what they got right, what they missed, and which
                                   # topics to review. This is stored on the question
                                   # and can be passed back to generate_quiz() as context
                                   # when the student re-generates a quiz from the same doc.
            "explanation": str,    # Model answer / ideal response shown in results.
        }

    TODO (Gemini): Replace stub with something like:
        model = genai.GenerativeModel("gemini-1.5-flash")

        qa_block = ""
        for i, q in enumerate(questions, 1):
            qa_block += (
                f"Q{i}: {q.question_text}\n"
                f"Student answer: {q.user_answer}\n\n"
            )

        context_block = ""
        if class_name:
            context_block += f"Class: {class_name}\n"
        if learning_objectives:
            context_block += f"Learning objectives: {learning_objectives}\n"

        prompt = (
            f"{context_block}"
            "You are grading free-response quiz questions. "
            "For each question below, return a JSON array item with:\n"
            "  is_correct: bool (true if the student demonstrated understanding)\n"
            "  feedback: personalised note on what they got right/wrong and topics to review\n"
            "  explanation: the ideal model answer\n\n"
            "Source material:\n"
            f"{document_text}\n\n"
            "Questions and student answers:\n"
            f"{qa_block}"
            "Return only a JSON array with one item per question."
        )
        response = model.generate_content(prompt)
        return json.loads(response.text)
    """
    # ── STUB ────────────────────────────────────────────────────────────────
    return [
        {
            "is_correct": True,
            "feedback": (
                "Stub feedback: your answer has been noted. "
                "When Gemini grading is enabled this will contain personalised feedback "
                "including topics to review."
            ),
            "explanation": (
                "Stub explanation: a model answer will appear here once "
                "Gemini grading is implemented."
            ),
        }
        for _ in questions
    ]
    # ── END STUB ─────────────────────────────────────────────────────────────
