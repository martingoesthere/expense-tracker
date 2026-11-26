import type { Expense, NewExpense } from "../types/expense";
import { ExpenseItem } from "./ExpenseItem";

interface ExpenseListProps {
  expenses: Expense[];
  editingId?: string | null;
  onDeleteExpense: (id: string) => void;
  onEditExpense: (id: string) => void;
  onSaveExpense: (id: string, changes: NewExpense) => void;
  onCancelEdit: () => void;
  emptyMessage?: string;
}

export function ExpenseList({
  expenses,
  editingId = null,
  onDeleteExpense,
  onEditExpense,
  onSaveExpense,
  onCancelEdit,
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
            isEditing={expense.id === editingId}
            onDelete={onDeleteExpense}
            onEdit={onEditExpense}
            onSave={onSaveExpense}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </ul>
    </>
  );
}
