import { describe, it, expect } from "vitest";
import { loadExpenses, saveExpenses, STORAGE_KEY } from "./storage";
import type { Expense } from "../types/expense";

const fallback: Expense[] = [
  {
    id: "1",
    title: "Groceries",
    amount: 12.5,
    category: "food",
    date: "2026-11-20",
  },
];

const savedExpenses: Expense[] = [
  {
    id: "abc",
    title: "Pizza",
    amount: 20,
    category: "fun",
    date: "2026-11-24",
  },
];

describe("loadExpenses", () => {
  it("returns the fallback when nothing is saved", () => {
    expect(loadExpenses(fallback)).toEqual(fallback);
  });

  it("returns the saved expenses when valid data exists", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedExpenses));

    expect(loadExpenses(fallback)).toEqual(savedExpenses);
  });

  it("returns an empty list when an empty list was saved", () => {
    localStorage.setItem(STORAGE_KEY, "[]");

    expect(loadExpenses(fallback)).toEqual([]);
  });

  it("returns the fallback when the saved data is not valid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not json");

    expect(loadExpenses(fallback)).toEqual(fallback);
  });

  it("returns the fallback when the saved JSON is not a list", () => {
    localStorage.setItem(STORAGE_KEY, '{"a":1}');

    expect(loadExpenses(fallback)).toEqual(fallback);
  });

  it("returns the fallback when the list contains something that is not an expense", () => {
    localStorage.setItem(STORAGE_KEY, '[{"title":"Missing fields"}]');

    expect(loadExpenses(fallback)).toEqual(fallback);
  });
});

describe("saveExpenses", () => {
  it("saves the expenses as JSON under the correct key", () => {
    saveExpenses(savedExpenses);

    expect(localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify(savedExpenses),
    );
  });

  it("saves expenses that can be loaded back", () => {
    saveExpenses(savedExpenses);

    expect(loadExpenses(fallback)).toEqual(savedExpenses);
  });
});
