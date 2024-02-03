import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  Purchase,
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  insertPurchase,
  newPurchase,
  updatePurchase,
} from "../../db/purchaseSchema";
import { getAllPayments, insertPayment } from "../../db/paymentSchema";

// Define the initial state of the purchase slice
const initialState = {
  purchases: [] as Purchase[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

// Define the async thunk for fetching all purchases
export const fetchAllPurchases = createAsyncThunk(
  "purchase/fetchAllPurchases",
  async (db: ExpoSQLiteDatabase<Record<string, never>>) => {
    // Fetch purchases from the database
    const results = await getAllPurchases(db);
    return results;
  }
);

/**
 * Fetches a purchase by its ID from the database.
 * @param db - The ExpoSQLiteDatabase instance.
 * @param id - The ID of the payment to fetch.
 * @returns A promise that resolves to the fetched payment.
 */
export const fetchPurchaseById = createAsyncThunk(
  "purchase/fetchPurchaseById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    const result = await getPurchaseById(db, id);
    return result;
  }
);

/**
 * Adds a new purchase to the database.
 */
export const addNewPurchase = createAsyncThunk(
  "purchase/addNewPurchase",
  async ({
    db,
    purchase,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    purchase: newPurchase;
  }) => {
    // Insert the new purchase into the database
    const newId = await insertPurchase(db, purchase);
    return newId;
  }
);

export const updatePurchaseById = createAsyncThunk(
  "purchase/updatePurchaseById",
  async ({
    db,
    id,
    purchase,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
    purchase: Purchase;
  }) => {
    // Update the purchase in the database
    const updatedId = await updatePurchase(db, id, purchase);
    return updatedId;
  }
);

export const deletePurchaseById = createAsyncThunk(
  "purchase/deletePurchaseById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    // Delete the purchase from the database
    const deletedId = await deletePurchase(db, id);
    return deletedId;
  }
);

// Define the purchase slice
const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchases = action.payload;
      })
      .addCase(fetchAllPurchases.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchases = action.payload;
      })
      .addCase(addNewPurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchases.push(action.payload);
      })
      .addCase(updatePurchaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.purchases.findIndex(
          (purchase) => purchase.id === action.payload.id
        );
        state.purchases[index] = action.payload;
      })
      .addCase(deletePurchaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchases = state.purchases.filter(
          (purchase) => purchase.id !== action.payload.id
        );
      });
  },
});

export default purchaseSlice.reducer;
