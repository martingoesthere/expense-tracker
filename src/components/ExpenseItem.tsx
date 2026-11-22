import type { Expense } from "../types/expense";
import { formatCurrency } from "../utils/formatCurrency";

const BIG_EXPENSE_LIMIT = 50;

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
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
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-bold text-rose-600">
          {formatCurrency(expense.amount)}
        </span>
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
