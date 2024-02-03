export type Payment = {
  id: number;
  companyId: number;
  amount: number;
  date: Date;
  paymentStatus: "paid" | "pending";
  remarks?: string;
};
