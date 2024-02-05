import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { getAllPendingPayments } from "../../db/paymentSchema";

const initialState = {
  pendingPayments: [] as {
    id: number;
    name: string | null;
    amount: number;
    date: string;
  }[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

export const fetchPendingPayments = createAsyncThunk(
  "journal/fetchPendingPayments",
  async (db: ExpoSQLiteDatabase<Record<string, never>>) => {
    const results = await getAllPendingPayments(db!);
    return results;
  }
);

const pendingPaymentsSlice = createSlice({
  name: "pendingPayments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingPayments.fulfilled, (state, action) => {
        console.log("pendingPayments", action.payload);
        state.status = "succeeded";
        state.pendingPayments = action.payload;
      })
      .addCase(fetchPendingPayments.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default pendingPaymentsSlice.reducer;
