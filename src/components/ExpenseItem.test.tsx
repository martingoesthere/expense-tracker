import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseItem } from "./ExpenseItem";
import type { Expense } from "../types/expense";

const sampleExpense: Expense = {
  id: "1",
  title: "Groceries",
  amount: 12.5,
  category: "food",
  date: "2026-11-20",
};

function renderItem(expense: Expense = sampleExpense, onDelete = vi.fn()) {
  render(
    <ul>
      <ExpenseItem expense={expense} onDelete={onDelete} />
    </ul>,
  );
  return { onDelete };
}

describe("ExpenseItem", () => {
  it("shows the expense title", () => {
    renderItem();

    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("shows the amount with a dollar sign and two decimals", () => {
    renderItem();

    expect(screen.getByText("$12.50")).toBeInTheDocument();
  });

  it("shows the category and the date", () => {
    renderItem();

    expect(screen.getByText("food · 2026-11-20")).toBeInTheDocument();
  });

  it("shows a BIG badge for expenses of 50 or more", () => {
    renderItem({ ...sampleExpense, amount: 75 });

    expect(screen.getByText("BIG")).toBeInTheDocument();
  });

  it("shows a BIG badge when the amount is exactly 50", () => {
    renderItem({ ...sampleExpense, amount: 50 });

    expect(screen.getByText("BIG")).toBeInTheDocument();
  });

  it("does not show a BIG badge for small expenses", () => {
    renderItem();

    expect(screen.queryByText("BIG")).not.toBeInTheDocument();
  });

  it("calls onDelete with the expense id when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderItem();

    await user.click(screen.getByRole("button", { name: "Delete Groceries" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
