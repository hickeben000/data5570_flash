import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const generateFlashcards = createAsyncThunk(
  "flashcards/generate",
  async ({ documentId, numCards = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/documents/${documentId}/flashcards/`,
        { num_cards: numCards }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to generate flashcards"
      );
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
      return rejectWithValue(
        err.response?.data || "Failed to fetch flashcard deck"
      );
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
      return rejectWithValue(
        err.response?.data || "Failed to update card status"
      );
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
  reducers: {},
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
      .addCase(updateCardStatus.fulfilled, (state, action) => {
        if (state.deck) {
          const idx = state.deck.cards.findIndex(
            (c) => c.id === action.payload.id
          );
          if (idx !== -1) {
            state.deck.cards[idx] = action.payload;
          }
        }
      });
  },
});

export default flashcardsSlice.reducer;
