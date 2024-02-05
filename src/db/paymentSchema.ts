import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { companies, payments } from "./schema";
import { and, eq, gte, lte } from "drizzle-orm";

/**
 * Represents a payment entry in the database.
 */
export type Payment = {
  id: number;
  companyId: number;
  amount: number;
  date: string;
  paymentStatus: "paid" | "pending";
  remarks?: string | null;
};

/**
 * Represents the type of a new payment entry in the database.
 */
export type newPayment = typeof payments.$inferInsert;

/**
 * Retrieves all payments from the database.
 *
 * @param db - The database connection.
 * @returns A promise that resolves to an array of payment entries.
 */
export const getAllPayments = async (
  db: ExpoSQLiteDatabase<Record<string, never>>
) => {
  const results = await db.select().from(payments);
  return results;
};

/**
 * Retrieves a payment from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the payment to retrieve.
 * @returns A promise that resolves to the payment entry.
 */

export const getPaymentById = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db.select().from(payments).where(eq(payments.id, id));
  return result;
};

/**
 * Inserts a new payment into the database.
 *
 * @param db - The database connection.
 * @param payment - The payment to insert.
 * @returns A promise that resolves to the ID of the new payment entry.
 */
export const insertPayment = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  payment: newPayment
) => {
  const result = await db.insert(payments).values(payment).returning();
  console.log(result[0]);
  return result[0];
};

/**
 * Updates an existing payment in the database.
 *
 * @param db - The database connection.
 * @param id - The ID of the payment to update.
 * @param payment - The new payment data.
 * @returns A promise that resolves to the number of rows affected.
 */

export const updatePayment = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number,
  payment: Payment
) => {
  const result = await db
    .update(payments)
    .set(payment)
    .where(eq(payments.id, id))
    .returning();

  return result[0];
};

/**
 * Deletes a payment from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the payment to delete.
 * @returns A promise that resolves to the number of rows affected.
 */
export const deletePayment = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db
    .delete(payments)
    .where(eq(payments.id, id))
    .returning();

  return result[0];
};

/**
 * Retrieves all payments for a company from the database.
 *
 * @param db - The database connection.
 * @param companyId - The ID of the company.
 * @returns A promise that resolves to an array of payment entries.
 */
export const getPaymentsByCompany = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  companyId: number
) => {
  const results = await db
    .select()
    .from(payments)
    .where(eq(payments.companyId, companyId));
  return results;
};

export const getUpcomingPayments = async (
  db: ExpoSQLiteDatabase<Record<string, never>>
) => {
  const results = await db
    .select({
      id: payments.id,
      name: companies.name,
      amount: payments.amount,
      date: payments.date,
    })
    .from(payments)
    .leftJoin(companies, eq(payments.companyId, companies.id))
    .where(
      and(
        eq(payments.paymentStatus, "pending"),
        gte(payments.date, new Date().toISOString())
      )
    );
  return results;
};

export const getAllPendingPayments = async (
  db: ExpoSQLiteDatabase<Record<string, never>>
) => {
  const results = await db
    .select({
      id: payments.id,
      name: companies.name,
      amount: payments.amount,
      date: payments.date,
    })
    .from(payments)
    .leftJoin(companies, eq(payments.companyId, companies.id))
    .where(
      and(
        eq(payments.paymentStatus, "pending"),
        lte(payments.date, new Date().toISOString())
      )
    );
  return results;
};
