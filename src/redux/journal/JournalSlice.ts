import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { getUpcomingPayments } from "../../db/paymentSchema";

const initialState = {
  upcomingPayments: [] as {
    name: string | null;
    amount: number;
    date: string;
  }[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

export const fetchUpcomingPayments = createAsyncThunk(
  "journal/fetchUpcomingPayments",
  async (db: ExpoSQLiteDatabase<Record<string, never>>) => {
    const results = await getUpcomingPayments(db!);
    return results;
  }
);

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUpcomingPayments.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUpcomingPayments.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.upcomingPayments = action.payload;
    });
    builder.addCase(fetchUpcomingPayments.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default journalSlice.reducer;
