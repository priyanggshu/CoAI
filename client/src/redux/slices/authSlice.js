import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithGooglePopup, auth } from "../../utils/firebase";
import axios from "axios";

export const signInWithGoogle = createAsyncThunk(
  "auth/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithGooglePopup();
      
      if (!result || !result.user) {
        return rejectWithValue("Google authentication failed.");
      }

      const idToken = await result.user.getIdToken();
      if (!idToken) {
        return rejectWithValue("No ID token received.");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/auth/google`, {
        token: idToken,
      });
      
      if (!response.data || !response.data.token) {
        return rejectWithValue("Invalid response from server.");
      }

      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      console.log("User logged out");
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        console.log("Google sign-in successful");
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        console.error("Google sign-in failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
