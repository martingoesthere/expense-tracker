import { CATEGORIES, type CategoryFilterValue } from "../types/expense";

const FILTER_OPTIONS: CategoryFilterValue[] = ["all", ...CATEGORIES];

interface CategoryFilterProps {
  selected: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="mb-4 flex flex-wrap gap-2"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = option === selected;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              isActive
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
