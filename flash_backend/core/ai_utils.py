"""
Stub AI utility functions.
These return hardcoded dummy data and will be replaced with real
Google Gemini API calls later.
"""


def generate_flashcards(document_text, num_cards=10):
    cards = []
    for i in range(1, num_cards + 1):
        cards.append({
            "front": f"Sample question {i} from the document?",
            "back": f"Sample answer {i} — this will be AI-generated from your content.",
        })
    return cards


def generate_quiz(document_text, difficulty, mc_count=2, fitb_count=1, fr_count=1):
    questions = []

    for i in range(1, mc_count + 1):
        questions.append({
            "question_type": "mc",
            "question_text": f"Sample multiple choice question {i}?",
            "choices": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "explanation": f"Option A is correct because this is stub data (question {i}).",
        })

    for i in range(1, fitb_count + 1):
        questions.append({
            "question_type": "fitb",
            "question_text": f"The _____ is a sample fill-in-the-blank question {i}.",
            "choices": None,
            "correct_answer": "answer",
            "explanation": f"The correct word is 'answer' (stub data, question {i}).",
        })

    for i in range(1, fr_count + 1):
        questions.append({
            "question_type": "free_response",
            "question_text": f"Explain the concept in sample free response question {i}.",
            "choices": None,
            "correct_answer": "A thorough explanation of the concept.",
            "explanation": f"A good answer covers the key points (stub data, question {i}).",
        })

    return questions
