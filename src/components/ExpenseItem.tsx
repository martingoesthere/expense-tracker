import type { Expense, NewExpense } from "../types/expense";
import { formatCurrency } from "../utils/formatCurrency";
import { ExpenseForm } from "./ExpenseForm";

const BIG_EXPENSE_LIMIT = 50;

export interface ExpenseItemProps {
  expense: Expense;
  isEditing?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, changes: NewExpense) => void;
  onCancelEdit: () => void;
}

export function ExpenseItem({
  expense,
  isEditing = false,
  onDelete,
  onEdit,
  onSave,
  onCancelEdit,
}: ExpenseItemProps) {
  if (isEditing) {
    return (
      <li>
        <ExpenseForm
          heading={`Edit ${expense.title}`}
          submitLabel="Save"
          initialValues={{
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
          }}
          onSubmit={(changes) => onSave(expense.id, changes)}
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  const isBig = expense.amount >= BIG_EXPENSE_LIMIT;

  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="flex items-center gap-2 font-semibold text-slate-800">
          {expense.title}
          {isBig && (
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
              BIG
            </span>
          )}
        </p>
        <p className="text-sm text-slate-500">
          {expense.category} · {expense.date}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span className="mr-2 font-mono text-lg font-bold text-rose-600">
          {formatCurrency(expense.amount)}
        </span>
        <button
          type="button"
          onClick={() => onEdit(expense.id)}
          aria-label={`Edit ${expense.title}`}
          className="rounded-md px-2 py-1 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.title}`}
          className="rounded-md px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
