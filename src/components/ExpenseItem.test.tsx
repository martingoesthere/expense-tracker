import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseItem, type ExpenseItemProps } from "./ExpenseItem";
import type { Expense } from "../types/expense";

const sampleExpense: Expense = {
  id: "1",
  title: "Groceries",
  amount: 12.5,
  category: "food",
  date: "2026-11-20",
};

function renderItem(overrides: Partial<ExpenseItemProps> = {}) {
  const props: ExpenseItemProps = {
    expense: sampleExpense,
    isEditing: false,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onSave: vi.fn(),
    onCancelEdit: vi.fn(),
    ...overrides,
  };

  render(
    <ul>
      <ExpenseItem {...props} />
    </ul>,
  );

  return props;
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
    renderItem({ expense: { ...sampleExpense, amount: 75 } });

    expect(screen.getByText("BIG")).toBeInTheDocument();
  });

  it("shows a BIG badge when the amount is exactly 50", () => {
    renderItem({ expense: { ...sampleExpense, amount: 50 } });

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

  it("calls onEdit with the expense id when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const { onEdit } = renderItem();

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));

    expect(onEdit).toHaveBeenCalledWith("1");
  });

  it("shows a filled-in form instead of the card while editing", () => {
    renderItem({ isEditing: true });

    expect(
      screen.getByRole("form", { name: "Edit Groceries" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Groceries");
    expect(
      screen.queryByRole("button", { name: "Delete Groceries" }),
    ).not.toBeInTheDocument();
  });

  it("calls onSave with the id and the values when Save is clicked", async () => {
    const user = userEvent.setup();
    const { onSave } = renderItem({ isEditing: true });

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("1", {
      title: "Groceries",
      amount: 12.5,
      category: "food",
      date: "2026-11-20",
    });
  });

  it("calls onCancelEdit when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const { onCancelEdit } = renderItem({ isEditing: true });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });
});
