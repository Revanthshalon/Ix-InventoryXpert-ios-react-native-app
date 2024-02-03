import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Payment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  insertPayment,
  newPayment,
  updatePayment,
} from "../../db/paymentSchema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

// Define the initial state of the payment slice
const initialState = {
  payments: [] as Payment[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

// Define the async thunk for fetching all payments
export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAllPayments",
  async (db: ExpoSQLiteDatabase<Record<string, never>>) => {
    // Fetch payments from the database
    const results = await getAllPayments(db);
    return results;
  }
);

/**
 * Fetches a payment by its ID from the database.
 * @param db - The ExpoSQLiteDatabase instance.
 * @param id - The ID of the payment to fetch.
 * @returns A promise that resolves to the fetched payment.
 */
export const fetchPaymentById = createAsyncThunk(
  "payment/fetchPaymentById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    const result = await getPaymentById(db, id);
    return result;
  }
);

/**
 * Adds a new payment to the database.
 */
export const addNewPayment = createAsyncThunk(
  "payment/addNewPayment",
  async ({
    db,
    payment,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    payment: newPayment;
  }) => {
    // Insert the new payment into the database
    const newPayment = await insertPayment(db, payment);
    return newPayment;
  }
);

/**
 * Updates an existing payment in the database.
 */
export const updatePaymentById = createAsyncThunk(
  "payment/updatePaymentById",
  async ({
    db,
    id,
    payment,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
    payment: Payment;
  }) => {
    // Update the payment in the database
    const result = await updatePayment(db, id, payment);
    return result;
  }
);

/**
 * Deletes a payment from the database by its ID.
 */
export const deletePaymentById = createAsyncThunk(
  "payment/deletePaymentById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    // Delete the payment from the database
    const result = await deletePayment(db, id);
    return result;
  }
);

// Define the payment slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload;
      })
      .addCase(addNewPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments.push(action.payload);
      })
      .addCase(updatePaymentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.payments.findIndex(
          (payment) => payment.id === action.payload.id
        );
        state.payments[index] = action.payload;
      })
      .addCase(deletePaymentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = state.payments.filter(
          (payment) => payment.id !== action.payload.id
        );
      });
  },
});

// Export the payment reducer
export default paymentSlice.reducer;
