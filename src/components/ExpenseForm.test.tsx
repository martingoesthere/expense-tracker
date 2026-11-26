import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { ExpenseForm } from "./ExpenseForm";
import type { NewExpense } from "../types/expense";

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

const existingExpense: NewExpense = {
  title: "Groceries",
  amount: 12.5,
  category: "fun",
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
    const handleSubmit = vi.fn();
    render(<ExpenseForm onSubmit={handleSubmit} />);

    await fillForm(user, validValues);
    await user.selectOptions(screen.getByLabelText("Category"), "fun");
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Coffee",
      amount: 12,
      category: "fun",
      date: "2026-11-20",
    });
  });

  it("clears the title after adding an expense", async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={vi.fn()} />);

    await fillForm(user, validValues);
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  it("shows an error and does not send when the title is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ExpenseForm onSubmit={handleSubmit} />);

    await fillForm(user, { ...validValues, title: "" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a title.",
    );
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows an error and does not send when the amount is 0", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ExpenseForm onSubmit={handleSubmit} />);

    await fillForm(user, { ...validValues, amount: "0" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter an amount greater than 0.",
    );
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows an error and does not send when the date is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ExpenseForm onSubmit={handleSubmit} />);

    await fillForm(user, { ...validValues, date: "" });
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Please pick a date.");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("names the form with its heading", () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("form", { name: "Add an expense" }),
    ).toBeInTheDocument();
  });

  it("starts filled in when initial values are given", () => {
    render(<ExpenseForm onSubmit={vi.fn()} initialValues={existingExpense} />);

    expect(screen.getByLabelText("Title")).toHaveValue("Groceries");
    expect(screen.getByLabelText("Amount")).toHaveValue(12.5);
    expect(screen.getByLabelText("Category")).toHaveValue("fun");
    expect(screen.getByLabelText("Date")).toHaveValue("2026-11-20");
  });

  it("sends the changed values when editing", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        initialValues={existingExpense}
        submitLabel="Save"
      />,
    );

    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Supermarket");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      ...existingExpense,
      title: "Supermarket",
    });
  });

  it("shows a custom button label when one is given", () => {
    render(<ExpenseForm onSubmit={vi.fn()} submitLabel="Save" />);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add expense" }),
    ).not.toBeInTheDocument();
  });

  it("does not show a Cancel button by default", () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();
  });

  it("shows a Cancel button that calls onCancel when it is given", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("gives every form its own inputs when two forms are on the screen", () => {
    render(
      <>
        <ExpenseForm onSubmit={vi.fn()} />
        <ExpenseForm onSubmit={vi.fn()} />
      </>,
    );

    const [firstTitle, secondTitle] = screen.getAllByLabelText("Title");
    expect(screen.getAllByLabelText("Title")).toHaveLength(2);
    expect(firstTitle).not.toBe(secondTitle);
  });
});
