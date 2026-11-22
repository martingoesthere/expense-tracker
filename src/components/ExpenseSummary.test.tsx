import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpenseSummary } from "./ExpenseSummary";
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

describe("ExpenseSummary", () => {
  it("shows the total of all expenses", () => {
    render(<ExpenseSummary expenses={sampleExpenses} />);

    expect(screen.getByText("$30.25")).toBeInTheDocument();
  });

  it("shows $0.00 when there are no expenses", () => {
    render(<ExpenseSummary expenses={[]} />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("shows the amount of a single expense as the total", () => {
    render(<ExpenseSummary expenses={[sampleExpenses[1]]} />);

    expect(screen.getByText("$2.75")).toBeInTheDocument();
  });

  it("shows the average of all expenses rounded to two decimals", () => {
    render(<ExpenseSummary expenses={sampleExpenses} />);

    expect(screen.getByText("Average: $10.08")).toBeInTheDocument();
  });

  it("shows an average of $0.00 (not $NaN) when there are no expenses", () => {
    render(<ExpenseSummary expenses={[]} />);

    expect(screen.getByText("Average: $0.00")).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });

  it('shows "Total spent" as the default title', () => {
    render(<ExpenseSummary expenses={sampleExpenses} />);

    expect(screen.getByText("Total spent")).toBeInTheDocument();
  });

  it("shows a custom title when one is given", () => {
    render(
      <ExpenseSummary expenses={sampleExpenses} title="Total spent on food" />,
    );

    expect(screen.getByText("Total spent on food")).toBeInTheDocument();
    expect(screen.queryByText("Total spent")).not.toBeInTheDocument();
  });
});
