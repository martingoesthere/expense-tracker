import { useId, type ChangeEvent } from "react";
import { SORT_OPTIONS, type SortOption } from "../types/expense";

interface ExpenseSortingProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function ExpenseSorting({ value, onChange }: ExpenseSortingProps) {
  const id = useId();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const chosen = SORT_OPTIONS.find(
      (option) => option.value === event.target.value,
    );

    if (chosen) {
      onChange(chosen.value);
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
