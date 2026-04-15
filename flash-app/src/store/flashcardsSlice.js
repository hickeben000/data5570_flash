import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { getGeminiApiKey } from "../utils/storage";

async function getAiHeaders() {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Add your Gemini API key in Settings before generating flashcards.");
  }
  return {
    "X-Gemini-Api-Key": apiKey,
  };
}

export const generateFlashcards = createAsyncThunk(
  "flashcards/generate",
  async (
    { documentId, additionalDocumentIds = [], numCards = 10, extraPrompt = "" },
    { rejectWithValue }
  ) => {
    try {
      const headers = await getAiHeaders();
      const response = await api.post(
        `/documents/${documentId}/flashcards/`,
        {
          num_cards: numCards,
          extra_prompt: extraPrompt,
          additional_document_ids: additionalDocumentIds,
        },
        { headers }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to generate flashcards");
    }
  }
);

export const fetchDeck = createAsyncThunk(
  "flashcards/fetchDeck",
  async (deckId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flashcard-decks/${deckId}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch flashcard deck");
    }
  }
);

export const updateCardStatus = createAsyncThunk(
  "flashcards/updateStatus",
  async ({ cardId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/flashcards/${cardId}/`, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update card status");
    }
  }
);

const flashcardsSlice = createSlice({
  name: "flashcards",
  initialState: {
    deck: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearFlashcardsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        state.deck = action.payload;
      })
      .addCase(generateFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeck.fulfilled, (state, action) => {
        state.loading = false;
        state.deck = action.payload;
      })
      .addCase(fetchDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCardStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCardStatus.fulfilled, (state, action) => {
        if (state.deck) {
          const index = state.deck.cards.findIndex(
            (card) => card.id === action.payload.id
          );
          if (index !== -1) {
            state.deck.cards[index] = action.payload;
          }
        }
      })
      .addCase(updateCardStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFlashcardsError } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
