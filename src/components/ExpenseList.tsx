import type { Expense } from "../types/expense";
import { ExpenseItem } from "./ExpenseItem";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  emptyMessage?: string;
}

export function ExpenseList({
  expenses,
  onDeleteExpense,
  emptyMessage = "No expenses yet. Add your first one!",
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  const label = expenses.length === 1 ? "expense" : "expenses";

  return (
    <>
      <p className="mb-3 text-sm text-slate-600">
        Showing {expenses.length} {label}
      </p>
      <ul className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={onDeleteExpense}
          />
        ))}
      </ul>
    </>
  );
}
