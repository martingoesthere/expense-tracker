import { CATEGORIES, type Expense } from "../types/expense";

export const STORAGE_KEY = "expense-tracker:expenses";

function isExpense(value: unknown): value is Expense {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "amount" in value &&
    typeof value.amount === "number" &&
    "category" in value &&
    CATEGORIES.some((category) => category === value.category) &&
    "date" in value &&
    typeof value.date === "string"
  );
}

export function loadExpenses(fallback: Expense[]): Expense[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(saved);

    if (Array.isArray(parsed) && parsed.every(isExpense)) {
      return parsed;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage can be full or blocked (for example in private browsing).
    // The app keeps working; it just can't save this time.
  }
}
