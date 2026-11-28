export type Category = "food" | "transport" | "housing" | "fun" | "other";

export const CATEGORIES: Category[] = [
  "food",
  "transport",
  "housing",
  "fun",
  "other",
];

export type SortOption = "newest" | "oldest" | "highest" | "lowest";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest date" },
  { value: "oldest", label: "Oldest date" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
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
