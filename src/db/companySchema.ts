import { companies } from "./schema";

/**
 * Represents a company entry in the database.
 */
export type Company = {
  id: number;
  name: string;
  gstNo?: string;
  address?: string;
  phone?: string;
  email?: string;
  existingBalance: number;
};

/**
 * Represents the type of a new company entry in the database.
 */
export type newCompany = typeof companies.$inferInsert;
