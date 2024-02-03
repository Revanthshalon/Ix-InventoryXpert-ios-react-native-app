import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./company/CompanySlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
