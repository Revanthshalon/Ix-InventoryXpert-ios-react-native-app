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
