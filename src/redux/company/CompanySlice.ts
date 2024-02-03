/**
 * This file contains the Redux slice for managing the company state.
 * It includes action creators and reducers for fetching, adding, updating, and deleting companies.
 * The slice also defines the initial state and the structure of the company object.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Company,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  insertCompany,
  newCompany,
  updateCompany,
} from "../../db/companySchema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

// Define the initial state of the company slice
const initialState = {
  companies: [] as Company[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

// Define the async thunk for fetching all companies
export const fetchAllCompanies = createAsyncThunk(
  "company/fetchAllCompanies",
  async (db: ExpoSQLiteDatabase<Record<string, never>>) => {
    // Fetch companies from the database
    const results = await getAllCompanies(db);
    return results;
  }
);

/**
 * Fetches a company by its ID from the database.
 * @param db - The ExpoSQLiteDatabase instance.
 * @param id - The ID of the company to fetch.
 * @returns A promise that resolves to the fetched company.
 */
export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    const result = await getCompanyById(db, id);
    return result;
  }
);

// Define the async thunk for adding a new company
export const addNewCompany = createAsyncThunk(
  "company/addNewCompany",
  async ({
    db,
    company,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    company: newCompany;
  }) => {
    const newCompany = await insertCompany(db, company);
    return newCompany;
  }
);

// Define the async thunk for updating a company by its ID
export const updateCompanyById = createAsyncThunk(
  "company/updateCompanyById",
  async ({
    db,
    id,
    company,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
    company: Company;
  }) => {
    const result = await updateCompany(db, id, company);
    return result;
  }
);

// Define the async thunk for deleting a company by its ID
export const deleteCompanyById = createAsyncThunk(
  "company/deleteCompanyById",
  async ({
    db,
    id,
  }: {
    db: ExpoSQLiteDatabase<Record<string, never>>;
    id: number;
  }) => {
    const result = await deleteCompany(db, id);
    return result;
  }
);

// Create the company slice
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addNewCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies.push(action.payload);
      })
      .addCase(addNewCompany.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companies.findIndex(
          (company) => company.id === action.payload.id
        );
        state.companies[index] = action.payload;
      })
      .addCase(updateCompanyById.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload.id
        );
      })
      .addCase(deleteCompanyById.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default companySlice.reducer;
