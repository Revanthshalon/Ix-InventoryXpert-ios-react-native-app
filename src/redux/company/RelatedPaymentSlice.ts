import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { Payment, getPaymentsByCompany } from "../../db/paymentSchema";

const initialState = {
  relatedPayments: [] as Payment[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

export const fetchRelatedPayments = createAsyncThunk(
  "company/fetchRelatedPayments",
  async ({
    db,
    companyId,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    companyId: number;
  }) => {
    const results = await getPaymentsByCompany(db!, companyId!);
    return results;
  }
);

const relatedPaymentsSlice = createSlice({
  name: "relatedPayments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRelatedPayments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.relatedPayments = action.payload;
      })
      .addCase(fetchRelatedPayments.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default relatedPaymentsSlice.reducer;
