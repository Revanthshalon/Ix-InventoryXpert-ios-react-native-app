export type Purchase = {
  id: number;
  companyId: number;
  amount: number;
  date: Date;
  billNo?: string;
  remarks?: string;
};
