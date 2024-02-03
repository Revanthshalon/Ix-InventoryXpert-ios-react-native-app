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
