import { payments } from "./schema";

/**
 * Represents a payment entry in the database.
 */
export type Payment = {
  id: number;
  companyId: number;
  amount: number;
  date: Date;
  paymentStatus: "paid" | "pending";
  remarks?: string;
};

/**
 * Represents the type of a new payment entry in the database.
 */
export type newPayment = typeof payments.$inferInsert;
