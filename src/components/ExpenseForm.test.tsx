import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { ExpenseForm } from "./ExpenseForm";

interface FormValues {
  title: string;
  amount: string;
  date: string;
}

const validValues: FormValues = {
  title: "Coffee",
  amount: "12",
  date: "2026-11-20",
};

async function fillForm(user: UserEvent, values: FormValues) {
  if (values.title) {
    await user.type(screen.getByLabelText("Title"), values.title);
  }
  if (values.amount) {
    await user.type(screen.getByLabelText("Amount"), values.amount);
  }
  if (values.date) {
    await user.type(screen.getByLabelText("Date"), values.date);
  }
}

describe("ExpenseForm", () => {
  it("sends the new expense when the form is filled in correctly", async () => {
    const user = userEvent.setup();
    const handleAddExpense = vi.fn();
    render(<ExpenseForm onAddExpense={handleAddExpense} />);

    await fillForm(user, validValues);
    await user.selectOptions(screen.getByLabelText("Category"), "fun");
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(handleAddExpense).toHaveBeenCalledTimes(1);
    expect(handleAddExpense).toHaveBeenCalledWith({
      title: "Coffee",
      amount: 12,
      category: "fun",
      date: "2026-11-20",
    });
  });

  it("clears the title after adding an expense", async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onAddExpense={vi.fn()} />);

    await fillForm(user, validValues);
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  it("shows an error and does not send when the title is empty", async () => {
    const user = userEvent.setup();
    const handleAddExpense = vi.fn();
    render(<ExpenseForm onAddExpense={handleAddExpense} />);

    await fillForm(user, { ...validValues, title: "" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a title.",
    );
    expect(handleAddExpense).not.toHaveBeenCalled();
  });

  it("shows an error and does not send when the amount is 0", async () => {
    const user = userEvent.setup();
    const handleAddExpense = vi.fn();
    render(<ExpenseForm onAddExpense={handleAddExpense} />);

    await fillForm(user, { ...validValues, amount: "0" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter an amount greater than 0.",
    );
    expect(handleAddExpense).not.toHaveBeenCalled();
  });

  it("shows an error and does not send when the date is empty", async () => {
    const user = userEvent.setup();
    const handleAddExpense = vi.fn();
    render(<ExpenseForm onAddExpense={handleAddExpense} />);

    await fillForm(user, { ...validValues, date: "" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Please pick a date.");
    expect(handleAddExpense).not.toHaveBeenCalled();
  });
});
