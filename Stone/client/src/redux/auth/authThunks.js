// src/redux/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios/axios"; // axios instance with baseURL + withCredentials

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Get Profile
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/profile");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Profile fetch failed";
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/logout");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);
