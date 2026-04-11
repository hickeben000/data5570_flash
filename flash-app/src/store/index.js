import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import coursesReducer from "./coursesSlice";
import documentsReducer from "./documentsSlice";
import flashcardsReducer from "./flashcardsSlice";
import quizzesReducer from "./quizzesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    documents: documentsReducer,
    flashcards: flashcardsReducer,
    quizzes: quizzesReducer,
  },
});

export default store;
