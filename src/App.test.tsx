import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import App from "./App";
import { STORAGE_KEY } from "./utils/storage";

async function addExpense(
  user: UserEvent,
  title: string,
  amount: string,
  date: string,
) {
  await user.type(screen.getByLabelText("Title"), title);
  await user.type(screen.getByLabelText("Amount"), amount);
  await user.type(screen.getByLabelText("Date"), date);
  await user.click(screen.getByRole("button", { name: "Add expense" }));
}

function getSummary() {
  return within(screen.getByRole("region", { name: "Summary" }));
}

describe("App", () => {
  it("shows the starting expenses", () => {
    render(<App />);

    expect(screen.getByText("Showing 4 expenses")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("adds a new expense to the list when the form is submitted", async () => {
    const user = userEvent.setup();
    render(<App />);

    await addExpense(user, "Pizza", "20", "2026-11-20");

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("Showing 5 expenses")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("puts the newest expense at the top of the list", async () => {
    const user = userEvent.setup();
    render(<App />);

    await addExpense(user, "Pizza", "20", "2026-11-20");

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Pizza");
  });

  it("can add more than one expense", async () => {
    const user = userEvent.setup();
    render(<App />);

    await addExpense(user, "Pizza", "20", "2026-11-20");
    await addExpense(user, "Taxi", "9", "2026-11-20");

    expect(screen.getByText("Showing 6 expenses")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Taxi");
  });

  it("does not add an expense when the form is invalid", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Amount"), "20");
    await user.type(screen.getByLabelText("Date"), "2026-11-20");
    await user.click(screen.getByRole("button", { name: "Add expense" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a title.",
    );
    expect(screen.getByText("Showing 4 expenses")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("shows the total of the starting expenses", () => {
    render(<App />);

    expect(screen.getByText("$110.25")).toBeInTheDocument();
  });

  it("updates the total after adding an expense", async () => {
    const user = userEvent.setup();
    render(<App />);

    await addExpense(user, "Pizza", "20", "2026-11-20");

    expect(screen.getByText("$130.25")).toBeInTheDocument();
  });

  it("removes an expense and updates the total when it is deleted", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete Groceries" }));

    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 3 expenses")).toBeInTheDocument();
    expect(screen.getByText("$97.75")).toBeInTheDocument();
  });

  it("shows the empty message and $0.00 after deleting every expense", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete Groceries" }));
    await user.click(screen.getByRole("button", { name: "Delete Bus ticket" }));
    await user.click(
      screen.getByRole("button", { name: "Delete Movie night" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete New shoes" }));

    expect(
      screen.getByText("No expenses yet. Add your first one!"),
    ).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("shows only the expenses of the chosen category", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "fun" }));

    expect(screen.getByText("Movie night")).toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 expense")).toBeInTheDocument();
    expect(getSummary().getByText("$15.00")).toBeInTheDocument();
  });

  it('shows every expense again when "all" is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "fun" }));
    await user.click(screen.getByRole("button", { name: "all" }));

    expect(screen.getByText("Showing 4 expenses")).toBeInTheDocument();
    expect(getSummary().getByText("$110.25")).toBeInTheDocument();
  });

  it("shows a category message when the chosen category has no expenses", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "housing" }));

    expect(screen.getByText("No housing expenses yet.")).toBeInTheDocument();
    expect(getSummary().getByText("$0.00")).toBeInTheDocument();
  });

  it("keeps a new expense hidden while a different category is chosen", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "fun" }));
    await addExpense(user, "Pizza", "20", "2026-11-20");

    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "all" }));

    expect(screen.getByText("Pizza")).toBeInTheDocument();
  });

  it("changes the summary title to match the chosen category", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(getSummary().getByText("Total spent")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "food" }));

    expect(getSummary().getByText("Total spent on food")).toBeInTheDocument();
    expect(getSummary().getByText("$12.50")).toBeInTheDocument();
  });

  it("remembers expenses after the app is closed and opened again", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await addExpense(user, "Pizza", "20", "2026-11-20");
    unmount();
    render(<App />);

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Showing 5 expenses")).toBeInTheDocument();
  });

  it("does not bring back the samples after deleting everything and reopening", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete Groceries" }));
    await user.click(screen.getByRole("button", { name: "Delete Bus ticket" }));
    await user.click(
      screen.getByRole("button", { name: "Delete Movie night" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete New shoes" }));
    unmount();
    render(<App />);

    expect(
      screen.getByText("No expenses yet. Add your first one!"),
    ).toBeInTheDocument();
  });

  it("starts with the saved expenses when there is saved data", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "x",
          title: "Saved rent",
          amount: 500,
          category: "housing",
          date: "2026-11-01",
        },
      ]),
    );

    render(<App />);

    expect(screen.getByText("Saved rent")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 expense")).toBeInTheDocument();
  });

  it("falls back to the sample expenses when the saved data is broken", () => {
    localStorage.setItem(STORAGE_KEY, "not json");

    render(<App />);

    expect(screen.getByText("Showing 4 expenses")).toBeInTheDocument();
  });
});
