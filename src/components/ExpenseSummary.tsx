import type { Expense } from "../types/expense";
import { formatCurrency } from "../utils/formatCurrency";

interface ExpenseSummaryProps {
  expenses: Expense[];
  title?: string;
}

export function ExpenseSummary({
  expenses,
  title = "Total spent",
}: ExpenseSummaryProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const average = expenses.length === 0 ? 0 : total / expenses.length;

  return (
    <section
      aria-label="Summary"
      className="mb-6 flex items-center justify-between rounded-lg bg-indigo-600 p-4 text-white shadow-sm"
    >
      <span className="font-medium">{title}</span>
      <div className="text-right">
        <p className="font-mono text-2xl font-bold">{formatCurrency(total)}</p>
        <p className="text-sm text-indigo-100">
          Average: {formatCurrency(average)}
        </p>
      </div>
    </section>
  );
}
