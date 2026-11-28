import { SORTING_CATEGORIES, type sorting_category } from "../types/expense";

interface ExpenseSortingProps {
  id?: string;
  sortBy: sorting_category;
  setSortBy: (value: sorting_category) => void;
  inputClass?: string;
}

export function ExpenseSorting({
  id = "expense",
  sortBy,
  setSortBy,
  inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
}: ExpenseSortingProps) {
  return (
    <div>
      <label
        htmlFor={`${id}-sort`}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Sort by
      </label>
      <select
        id={`${id}-sort`}
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value as sorting_category)}
        className={`${inputClass} capitalize`}
      >
        {SORTING_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
