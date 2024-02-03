/**
 * Defines the SQLite database schema for the inventory-xpert-ios application.
 */

import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Represents the "companies" table in the database.
 */
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
  gstNo: text("gstNo").unique(),
  address: text("address"),
  phone: text("phone").unique(),
  email: text("email").unique(),
  existingBalance: real("existingBalance").default(0.0).notNull(),
});

/**
 * Represents the "purchases" table in the database.
 */
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("companyId")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  amount: real("amount").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  billNo: text("billNo"),
  remarks: text("remarks"),
});

/**
 * Represents the "payments" table in the database.
 */
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("companyId")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  amount: real("amount").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  paymentStatus: text("paymentStatus", { enum: ["paid", "pending"] })
    .default("pending")
    .notNull(),
  remarks: text("remarks"),
});
