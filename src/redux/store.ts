import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./company/CompanySlice";
import paymentReducer from "./payment/paymentSlice";
import purchaseReducer from "./purchase/PurchaseSlice";
import journalReducer from "./journal/JournalSlice";
import relatedPurchasesReducer from "./company/RelatedPurchasesSlice";
import relatedPaymentsReducer from "./company/RelatedPaymentSlice";
import companyDetailsReducer from "./company/CompanyDetailsSlice";
import pendingPaymentsReducer from "./journal/PendingPaymentsSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    payment: paymentReducer,
    purchase: purchaseReducer,
    journal: journalReducer,
    relatedPurchases: relatedPurchasesReducer,
    relatedPayments: relatedPaymentsReducer,
    companyDetails: companyDetailsReducer,
    pendingPayments: pendingPaymentsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
