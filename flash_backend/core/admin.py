from django.contrib import admin

from .models import Course, Document, Flashcard, FlashcardDeck, Quiz, QuizQuestion

admin.site.register(Course)
admin.site.register(Document)
admin.site.register(FlashcardDeck)
admin.site.register(Flashcard)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)
