import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { companies } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Represents a company entry in the database.
 */
export type Company = {
  id: number;
  name: string;
  gstNo?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  existingBalance: number;
};

/**
 * Represents the type of a new company entry in the database.
 */
export type newCompany = typeof companies.$inferInsert;

/**
 * Retrieves all companies from the database.
 *
 * @param db - The database connection.
 * @returns A promise that resolves to an array of company entries.
 */
export const getAllCompanies = async (
  db: ExpoSQLiteDatabase<Record<string, never>>
) => {
  const results = await db.select().from(companies);
  return results;
};

/**
 * Retrieves a company from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the company to retrieve.
 * @returns A promise that resolves to the company entry.
 */
export const getCompanyById = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db.select().from(companies).where(eq(companies.id, id));
  return result;
};

/**
 * Inserts a new company into the database.
 *
 * @param db - The database connection.
 * @param company - The company to insert.
 * @returns A promise that resolves to the ID of the new company entry.
 */
export const insertCompany = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  company: newCompany
) => {
  const result = await db.insert(companies).values(company).returning();

  return result[0];
};

/**
 * Updates an existing company in the database.
 *
 * @param db - The database connection.
 * @param id - The ID of the company to update.
 * @param company - The new company data.
 * @returns A promise that resolves to the number of updated rows.
 */
export const updateCompany = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number,
  company: Company
) => {
  const result = await db
    .update(companies)
    .set(company)
    .where(eq(companies.id, id))
    .returning();

  return result[0];
};

/**
 * Deletes a company from the database by its ID.
 *
 * @param db - The database connection.
 * @param id - The ID of the company to delete.
 * @returns A promise that resolves to the number of deleted rows.
 */

export const deleteCompany = async (
  db: ExpoSQLiteDatabase<Record<string, never>>,
  id: number
) => {
  const result = await db
    .delete(companies)
    .where(eq(companies.id, id))
    .returning();

  return result[0];
};
