import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getRequiredAiHeaders } from "../api/api";

export const generateQuiz = createAsyncThunk(
  "quizzes/generate",
  async (
    {
      documentId,
      additionalDocumentIds = [],
      difficulty,
      mc_count,
      fitb_count,
      fr_count,
      class_name = "",
      learning_objectives = "",
      extra_prompt = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const headers = await getRequiredAiHeaders(
        "Add your OpenAI API key in Settings before generating a quiz."
      );
      const sanitizedMcCount = Math.max(0, parseInt(mc_count, 10) || 0);
      const sanitizedFitbCount = Math.max(0, parseInt(fitb_count, 10) || 0);
      const sanitizedFrCount = Math.max(0, parseInt(fr_count, 10) || 0);
      if (sanitizedMcCount + sanitizedFitbCount + sanitizedFrCount <= 0) {
        throw new Error("Choose at least one quiz question before generating.");
      }
      const response = await api.post(
        `/documents/${documentId}/quizzes/`,
        {
          difficulty,
          mc_count: sanitizedMcCount,
          fitb_count: sanitizedFitbCount,
          fr_count: sanitizedFrCount,
          class_name,
          learning_objectives,
          extra_prompt,
          additional_document_ids: additionalDocumentIds,
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to generate quiz");
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
  async ({ quizId, answers }, { rejectWithValue, getState }) => {
    try {
      const questions = getState().quizzes.quiz?.questions || [];
      const needsAiKey = questions.some(
        (question) => question.question_type === "free_response"
      );
      const headers = needsAiKey
        ? await getRequiredAiHeaders(
            "Add your OpenAI API key in Settings before submitting free-response answers."
          )
        : {};

      const response = await api.put(
        `/quizzes/${quizId}/submit/`,
        { answers },
        { headers }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to submit quiz");
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
  reducers: {
    clearQuizError(state) {
      state.error = null;
    },
  },
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

export const { clearQuizError } = quizzesSlice.actions;
export default quizzesSlice.reducer;
