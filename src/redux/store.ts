import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./company/CompanySlice";
import paymentReducer from "./payment/paymentSlice";
import purchaseReducer from "./purchase/PurchaseSlice";
import journalReducer from "./journal/JournalSlice";
import relatedPurchasesReducer from "./company/RelatedPurchasesSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    payment: paymentReducer,
    purchase: purchaseReducer,
    journal: journalReducer,
    relatedPurchases: relatedPurchasesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
