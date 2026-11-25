import { useState, useEffect } from "react";
import { CategoryFilter } from "./components/CategoryFilter";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseSummary } from "./components/ExpenseSummary";
import type { CategoryFilterValue, Expense, NewExpense } from "./types/expense";

const STORAGE_KEY = "expenses";

const sampleExpenses: Expense[] = [
  {
    id: "1",
    title: "Groceries",
    amount: 12.5,
    category: "food",
    date: "2026-11-20",
  },
  {
    id: "2",
    title: "Bus ticket",
    amount: 2.75,
    category: "transport",
    date: "2026-11-19",
  },
  {
    id: "3",
    title: "Movie night",
    amount: 15,
    category: "fun",
    date: "2026-11-18",
  },
  {
    id: "4",
    title: "New shoes",
    amount: 80,
    category: "other",
    date: "2026-11-17",
  },
];

// 💾 Reads saved expenses. Falls back to the samples if nothing is saved or the data is broken.
function loadExpenses(): Expense[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Expense[]) : sampleExpenses;
  } catch {
    return sampleExpenses;
  }
}

function App() {
  // 💾 LOAD once when the app opens
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);

  // 💾 SAVE every time expenses change (add or delete)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("all");

  const isShowingAll = selectedCategory === "all";

  const visibleExpenses = isShowingAll
    ? expenses
    : expenses.filter((expense) => expense.category === selectedCategory);

  const emptyMessage = isShowingAll
    ? "No expenses yet. Add your first one!"
    : `No ${selectedCategory} expenses yet.`;

  const summaryTitle = isShowingAll
    ? "Total spent"
    : `Total spent on ${selectedCategory}`;

  function handleAddExpense(newExpense: NewExpense) {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };

    setExpenses((previousExpenses) => [expense, ...previousExpenses]);
  }

  function handleDeleteExpense(id: string) {
    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.id !== id),
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Expense Tracker
        </h1>
        <ExpenseSummary expenses={visibleExpenses} title={summaryTitle} />
        <ExpenseForm onAddExpense={handleAddExpense} />
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <ExpenseList
          expenses={visibleExpenses}
          onDeleteExpense={handleDeleteExpense}
          emptyMessage={emptyMessage}
        />
      </div>
    </main>
  );
}

export default App;
