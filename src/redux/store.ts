import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./company/CompanySlice";
import paymentReducer from "./payment/paymentSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    payment: paymentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
