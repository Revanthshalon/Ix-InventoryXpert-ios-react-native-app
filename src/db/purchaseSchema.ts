import { purchases } from "./schema";

/**
 * Represents a purchase entry in the database.
 */
export type Purchase = {
  id: number;
  companyId: number;
  amount: number;
  date: Date;
  billNo?: string;
  remarks?: string;
};

/**
 * Represents the type of a new payment entry in the database.
 * It is inferred from the "purchases" schema.
 */
export type newPayment = typeof purchases.$inferInsert;
