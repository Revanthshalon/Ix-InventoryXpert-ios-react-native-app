import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { Purchase, getPurchasesByCompany } from "../../db/purchaseSchema";

const initialState = {
  relatedPurchases: [] as Purchase[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

export const fetchRelatedPurchases = createAsyncThunk(
  "company/fetchRelatedPurchases",
  async ({
    db,
    companyId,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    companyId: number;
  }) => {
    const results = await getPurchasesByCompany(db!, companyId!);
    return results;
  }
);

const relatedPurchasesSlice = createSlice({
  name: "relatedPurchases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRelatedPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.relatedPurchases = action.payload;
      })
      .addCase(fetchRelatedPurchases.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default relatedPurchasesSlice.reducer;
