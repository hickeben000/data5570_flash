import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/documents/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch documents"
      );
    }
  }
);

export const createDocument = createAsyncThunk(
  "documents/create",
  async ({ course, title, raw_text, source_type = "paste" }, { rejectWithValue }) => {
    try {
      const response = await api.post("/documents/", {
        course,
        title,
        raw_text,
        source_type,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to create document"
      );
    }
  }
);

const documentsSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default documentsSlice.reducer;
