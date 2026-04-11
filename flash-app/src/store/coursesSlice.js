import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch courses");
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/create",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await api.post("/courses/", { name });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create course");
    }
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
