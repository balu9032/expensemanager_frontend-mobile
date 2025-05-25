export interface Expense {
  id: number;
  amount: number;
  amountType: 'credit' | 'debit';
  description?: string;
  date?: string;
}