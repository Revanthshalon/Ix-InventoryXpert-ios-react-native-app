import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCompanyById } from "../../db/companySchema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { Company } from "../../db/companySchema";

// Define the initial state of the company details slice
const initialState = {
  company: {} as Company,
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

// Define the async thunk for fetching a company by its ID
export const fetchCompanyById = createAsyncThunk(
  "companyDetails/fetchCompanyById",
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

// Define the company details slice
const companyDetailsSlice = createSlice({
  name: "companyDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.company = action.payload[0];
      })
      .addCase(fetchCompanyById.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Export the company details slice reducer
export default companyDetailsSlice.reducer;
