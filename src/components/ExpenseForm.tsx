import { useState, type FormEvent } from "react";
import { CATEGORIES, type Category, type NewExpense } from "../types/expense";

interface ExpenseFormProps {
  onAddExpense: (expense: NewExpense) => void;
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none";

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const parsedAmount = Number(amount);

    if (trimmedTitle === "") {
      setError("Please enter a title.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter an amount greater than 0.");
      return;
    }

    if (date === "") {
      setError("Please pick a date.");
      return;
    }

    onAddExpense({
      title: trimmedTitle,
      amount: parsedAmount,
      category,
      date,
    });

    setTitle("");
    setAmount("");
    setCategory("food");
    setDate("");
    setError(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-800">Add an expense</h2>

      <div>
        <label
          htmlFor="expense-title"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Title
        </label>
        <input
          id="expense-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expense-amount"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="expense-category"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="expense-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
            className={`${inputClass} capitalize`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="expense-date"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
      >
        Add expense
      </button>
    </form>
  );
}
