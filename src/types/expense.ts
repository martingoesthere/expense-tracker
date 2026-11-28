export type Category = "food" | "transport" | "housing" | "fun" | "other";

export const CATEGORIES: Category[] = [
  "food",
  "transport",
  "housing",
  "fun",
  "other",
];

export type sorting_category =
  | "Newest date"
  | "Oldest date"
  | "Highest amount"
  | "Lowest amount";

export const SORTING_CATEGORIES: sorting_category[] = [
  "Newest date",
  "Oldest date",
  "Highest amount",
  "Lowest amount",
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
