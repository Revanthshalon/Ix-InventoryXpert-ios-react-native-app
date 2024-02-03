import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { purchases } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Represents a purchase entry in the database.
 */
export type Purchase = {
  id: number;
  companyId: number;
  amount: number;
  date: Date;
  billNo?: string | null;
  remarks?: string | null;
};

/**
 * Represents the type of a new payment entry in the database.
 * It is inferred from the "purchases" schema.
 */
export type newPurchase = typeof purchases.$inferInsert;

/**
 * Retrieves all purchases from the database.
 *
 * @param db - The database connection.
 * @returns A promise that resolves to an array of purchase entries.
 */
export const getAllPurchases = async (
  db: ExpoSQLiteDatabase<Record<string, never>>
) => {
  const results = await db.select().from(purchases);
  return results;
};

/**
 * Retrieves a purchase from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the purchase to retrieve.
 * @returns A promise that resolves to the purchase entry.
 */
export const getPurchaseById = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db.select().from(purchases).where(eq(purchases.id, id));
  return result;
};

/**
 * Inserts a new purchase into the database.
 *
 * @param db - The database connection.
 * @param purchase - The purchase to insert.
 * @returns A promise that resolves to the ID of the new purchase entry.
 */
export const insertPurchase = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  purchase: newPurchase
) => {
  const newPurchase = await db.insert(purchases).values(purchase).returning();
  return newPurchase[0];
};

/**
 * Updates an existing purchase in the database.
 *
 * @param db - The database connection.
 * @param id - The ID of the purchase to update.
 * @param purchase - The new purchase data.
 * @returns A promise that resolves to the number of updated rows.
 */
export const updatePurchase = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number,
  purchase: Purchase
) => {
  const result = await db
    .update(purchases)
    .set(purchase)
    .where(eq(purchases.id, id))
    .returning();
  return result[0];
};

/**
 * Deletes a purchase from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the purchase to delete.
 * @returns A promise that resolves to the number of deleted rows.
 */
export const deletePurchase = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db
    .delete(purchases)
    .where(eq(purchases.id, id))
    .returning();
  return result[0];
};

/**
 * Retrieves all purchases from the database for a given company.
 *
 * @param db - The database connection.
 * @param companyId - The ID of the company to retrieve purchases for.
 * @returns A promise that resolves to an array of purchase entries.
 */
export const getPurchasesByCompany = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  companyId: number
) => {
  const results = await db
    .select()
    .from(purchases)
    .where(eq(purchases.companyId, companyId));
  return results;
};
