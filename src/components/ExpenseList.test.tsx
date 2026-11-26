import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseList } from "./ExpenseList";
import type { Expense } from "../types/expense";

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
];

function renderList(
  expenses: Expense[] = sampleExpenses,
  editingId: string | null = null,
) {
  const handlers = {
    onDeleteExpense: vi.fn(),
    onEditExpense: vi.fn(),
    onSaveExpense: vi.fn(),
    onCancelEdit: vi.fn(),
  };

  render(
    <ExpenseList expenses={expenses} editingId={editingId} {...handlers} />,
  );

  return handlers;
}

describe("ExpenseList", () => {
  it("shows one list item for each expense", () => {
    renderList();

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows the title of every expense", () => {
    renderList();

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Bus ticket")).toBeInTheDocument();
    expect(screen.getByText("Movie night")).toBeInTheDocument();
  });

  it("shows a friendly message when there are no expenses", () => {
    renderList([]);

    expect(
      screen.getByText("No expenses yet. Add your first one!"),
    ).toBeInTheDocument();
  });

  it("shows a custom empty message when one is given", () => {
    render(
      <ExpenseList
        expenses={[]}
        onDeleteExpense={vi.fn()}
        onEditExpense={vi.fn()}
        onSaveExpense={vi.fn()}
        onCancelEdit={vi.fn()}
        emptyMessage="Nothing here."
      />,
    );

    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
    expect(
      screen.queryByText("No expenses yet. Add your first one!"),
    ).not.toBeInTheDocument();
  });

  it("does not show a list when there are no expenses", () => {
    renderList([]);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows the count with the plural word when there are many expenses", () => {
    renderList();

    expect(screen.getByText("Showing 3 expenses")).toBeInTheDocument();
  });

  it("shows the count with the singular word when there is one expense", () => {
    renderList([sampleExpenses[0]]);

    expect(screen.getByText("Showing 1 expense")).toBeInTheDocument();
  });

  it("calls onDeleteExpense with the right id when an item is deleted", async () => {
    const user = userEvent.setup();
    const { onDeleteExpense } = renderList();

    await user.click(screen.getByRole("button", { name: "Delete Bus ticket" }));

    expect(onDeleteExpense).toHaveBeenCalledWith("2");
  });

  it("calls onEditExpense with the right id when Edit is clicked", async () => {
    const user = userEvent.setup();
    const { onEditExpense } = renderList();

    await user.click(screen.getByRole("button", { name: "Edit Bus ticket" }));

    expect(onEditExpense).toHaveBeenCalledWith("2");
  });

  it("shows the edit form only for the expense being edited", () => {
    renderList(sampleExpenses, "2");

    expect(
      screen.getByRole("form", { name: "Edit Bus ticket" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: "Edit Groceries" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });
});
