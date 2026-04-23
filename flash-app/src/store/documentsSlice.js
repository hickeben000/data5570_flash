import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

function buildUploadFormData({ course, title, file }) {
  const formData = new FormData();

  formData.append("course", String(course));

  if (title?.trim()) {
    formData.append("title", title.trim());
  }

  // KEY FIX: handle web vs mobile differently
  if (file?.file) {
    // Web
    formData.append("file", file.file);
  } else {
    // Mobile
    formData.append("file", {
      uri: file.uri,
      name: file.name || "upload",
      type: file.mimeType || file.type || "application/octet-stream",
    });
  }

  return formData;
}

export const fetchDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/documents/`);
      return {
        courseId,
        documents: response.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch documents");
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (documentId, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/${documentId}/`);
      return documentId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete document");
    }
  }
);

export const createDocument = createAsyncThunk(
  "documents/create",
  async ({ course, title, rawText, file }, { rejectWithValue }) => {
    try {
      let response;

      if (file) {
        const formData = buildUploadFormData({ course, title, file });

        response = await api.post("/documents/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/documents/", {
          course,
          title,
          raw_text: rawText,
          source_type: "paste",
        });
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create document");
    }
  }
);

const documentsSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
    currentCourseId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDocumentsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourseId = action.payload.courseId;
        state.documents = action.payload.documents;
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
        state.documents.unshift(action.payload);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDocumentsError } = documentsSlice.actions;
export default documentsSlice.reducer;