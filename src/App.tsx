import { useState, useEffect } from "react";
import { CategoryFilter } from "./components/CategoryFilter";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseSummary } from "./components/ExpenseSummary";
import type { CategoryFilterValue, Expense, NewExpense } from "./types/expense";
import { loadExpenses, saveExpenses } from "./utils/storage";

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

function App() {
  // 💾 LOAD once when the app opens (samples on the very first visit)
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadExpenses(sampleExpenses),
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  // 💾 SAVE every time expenses change (add, edit or delete)
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

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

  function handleSaveExpense(id: string, changes: NewExpense) {
    console.log(id);
    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) =>
        expense.id === id ? { ...changes, id } : expense,
      ),
    );
    setEditingId(null);
  }

  function handleDeleteExpense(id: string) {
    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.id !== id),
    );
    setEditingId((currentId) => (currentId === id ? null : currentId));
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Expense Tracker
        </h1>
        <ExpenseSummary expenses={visibleExpenses} title={summaryTitle} />
        <div className="mb-6">
          <ExpenseForm onSubmit={handleAddExpense} />
        </div>
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <ExpenseList
          expenses={visibleExpenses}
          editingId={editingId}
          onDeleteExpense={handleDeleteExpense}
          onEditExpense={setEditingId}
          onSaveExpense={handleSaveExpense}
          onCancelEdit={() => setEditingId(null)}
          emptyMessage={emptyMessage}
        />
      </div>
    </main>
  );
}

export default App;
