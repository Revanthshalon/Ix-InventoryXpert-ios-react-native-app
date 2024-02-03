import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./company/CompanySlice";
import paymentReducer from "./payment/paymentSlice";
import purchaseReducer from "./purchase/PurchaseSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    payment: paymentReducer,
    purchase: purchaseReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
