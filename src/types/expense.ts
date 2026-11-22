export type Category = "food" | "transport" | "housing" | "fun" | "other";

export const CATEGORIES: Category[] = [
  "food",
  "transport",
  "housing",
  "fun",
  "other",
];

export type CategoryFilterValue = Category | "all";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
}

export type NewExpense = Omit<Expense, "id">;
