import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const generateQuiz = createAsyncThunk(
  "quizzes/generate",
  async (
    { documentId, difficulty, mc_count, fitb_count, fr_count },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/documents/${documentId}/quizzes/`, {
        difficulty,
        mc_count,
        fitb_count,
        fr_count,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to generate quiz"
      );
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  "quizzes/fetch",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch quiz");
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quizzes/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/quizzes/${quizId}/submit/`, {
        answers,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to submit quiz");
    }
  }
);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    quiz: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quizzesSlice.reducer;
