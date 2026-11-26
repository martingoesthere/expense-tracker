import { useId, useState, type FormEvent } from "react";
import { CATEGORIES, type Category, type NewExpense } from "../types/expense";

interface ExpenseFormProps {
  onSubmit: (expense: NewExpense) => void;
  initialValues?: NewExpense;
  heading?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none";

export function ExpenseForm({
  onSubmit,
  initialValues,
  heading = "Add an expense",
  submitLabel = "Add expense",
  onCancel,
}: ExpenseFormProps) {
  const id = useId();
  const isEditMode = initialValues !== undefined;

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [amount, setAmount] = useState(initialValues?.amount.toString() ?? "");
  const [category, setCategory] = useState<Category>(
    initialValues?.category ?? "food",
  );
  const [date, setDate] = useState(initialValues?.date ?? "");
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

    onSubmit({
      title: trimmedTitle,
      amount: parsedAmount,
      category,
      date,
    });

    setError(null);

    if (!isEditMode) {
      setTitle("");
      setAmount("");
      setCategory("food");
      setDate("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${id}-heading`}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 id={`${id}-heading`} className="text-lg font-semibold text-slate-800">
        {heading}
      </h2>

      <div>
        <label
          htmlFor={`${id}-title`}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Title
        </label>
        <input
          id={`${id}-title`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`${id}-amount`}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>
          <input
            id={`${id}-amount`}
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor={`${id}-category`}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id={`${id}-category`}
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
          htmlFor={`${id}-date`}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Date
        </label>
        <input
          id={`${id}-date`}
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

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
