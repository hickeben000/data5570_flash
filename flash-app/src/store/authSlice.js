import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../api/api";
import {
  clearSession,
  loadSession,
  persistSession,
} from "../utils/storage";

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    const session = await loadSession();
    if (session?.token) {
      setAuthToken(session.token);
    } else {
      setAuthToken(null);
    }
    return session;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/register/", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login/", { username, password });
      const session = {
        token: response.data.token,
        user: {
          id: response.data.user_id,
          username: response.data.username,
        },
      };
      setAuthToken(session.token);
      await persistSession(session);
      return session;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await clearSession();
  setAuthToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    bootstrapping: true,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.bootstrapping = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.bootstrapping = false;
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.bootstrapping = false;
        state.token = null;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
