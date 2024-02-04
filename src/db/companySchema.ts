import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { companies, payments, purchases } from "./schema";
import { eq, sql, sum } from "drizzle-orm";
import { unionAll } from "drizzle-orm/sqlite-core";

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
  const paymentTotal = db
    .select({
      companyId: payments.companyId,
      paymentAmount: sql`cast(sum(${payments.amount}) as real)`.as(
        "paymentAmount"
      ),
    })
    .from(payments)
    .where(eq(payments.paymentStatus, "paid"))
    .groupBy(payments.companyId)
    .as("paymentTotal");

  const purchaseTotal = db
    .select({
      companyId: purchases.companyId,
      purchaseAmount: sql`cast(sum(${purchases.amount}) as real)`.as(
        "purchaseAmount"
      ),
    })
    .from(purchases)
    .groupBy(purchases.companyId)
    .as("purchaseTotal");

  const results = await db
    .select({
      id: companies.id,
      name: companies.name,
      gstNo: companies.gstNo,
      address: companies.address,
      phone: companies.phone,
      email: companies.email,
      existingBalance: sql<number>`cast(${companies.existingBalance} as real) - coalesce(${paymentTotal.paymentAmount}, 0) + coalesce(${purchaseTotal.purchaseAmount}, 0) as existingBalance`,
      paymentAmount: paymentTotal.paymentAmount,
    })
    .from(companies)
    .leftJoin(paymentTotal, eq(companies.id, paymentTotal.companyId))
    .leftJoin(purchaseTotal, eq(companies.id, purchaseTotal.companyId));
  console.log(results);

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
