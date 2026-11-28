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

function getEditForm(title: string) {
  return within(screen.getByRole("form", { name: `Edit ${title}` }));
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

  // 💾 ET-101: saving in localStorage

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

  // ✏️ ET-102: editing an expense

  it("edits an expense in place and updates the total", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));
    const form = getEditForm("Groceries");
    await user.clear(form.getByLabelText("Title"));
    await user.type(form.getByLabelText("Title"), "Supermarket");
    await user.clear(form.getByLabelText("Amount"));
    await user.type(form.getByLabelText("Amount"), "20");
    await user.click(form.getByRole("button", { name: "Save" }));

    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Supermarket");
    expect(screen.getByText("Showing 4 expenses")).toBeInTheDocument();
    expect(getSummary().getByText("$117.75")).toBeInTheDocument();
  });

  it("keeps the original values when editing is cancelled", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));
    const form = getEditForm("Groceries");
    await user.clear(form.getByLabelText("Title"));
    await user.type(form.getByLabelText("Title"), "Something else");
    await user.click(form.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.queryByText("Something else")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: "Edit Groceries" }),
    ).not.toBeInTheDocument();
  });

  it("shows an error and stays in edit mode when the edit is invalid", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));
    const form = getEditForm("Groceries");
    await user.clear(form.getByLabelText("Title"));
    await user.click(form.getByRole("button", { name: "Save" }));

    expect(form.getByRole("alert")).toHaveTextContent("Please enter a title.");
    expect(
      screen.getByRole("form", { name: "Edit Groceries" }),
    ).toBeInTheDocument();
  });

  it("only lets one expense be edited at a time", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));
    await user.click(screen.getByRole("button", { name: "Edit Bus ticket" }));

    expect(
      screen.queryByRole("form", { name: "Edit Groceries" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("form", { name: "Edit Bus ticket" }),
    ).toBeInTheDocument();
  });

  it("remembers an edit after the app is closed and opened again", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit Groceries" }));
    const form = getEditForm("Groceries");
    await user.clear(form.getByLabelText("Title"));
    await user.type(form.getByLabelText("Title"), "Supermarket");
    await user.click(form.getByRole("button", { name: "Save" }));
    unmount();
    render(<App />);

    expect(screen.getByText("Supermarket")).toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  });

  // ↕️ ET-103: sorting

  it("sorts by newest date by default", () => {
    render(<App />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Groceries");
    expect(items[3]).toHaveTextContent("New shoes");
  });

  it("sorts by oldest date", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Sort by"), "Oldest date");

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("New shoes");
    expect(items[3]).toHaveTextContent("Groceries");
  });

  it("sorts by highest amount", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Sort by"),
      "Highest amount",
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("New shoes");
    expect(items[3]).toHaveTextContent("Bus ticket");
  });

  it("sorts by lowest amount", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Sort by"), "Lowest amount");

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Bus ticket");
    expect(items[3]).toHaveTextContent("New shoes");
  });

  it("sorts and filters at the same time", async () => {
    const user = userEvent.setup();
    render(<App />);

    await addExpense(user, "Big dinner", "40", "2026-11-01");
    await user.click(screen.getByRole("button", { name: "food" }));
    await user.selectOptions(
      screen.getByLabelText("Sort by"),
      "Highest amount",
    );

    let items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Big dinner");

    await user.selectOptions(screen.getByLabelText("Sort by"), "Lowest amount");

    items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Groceries");
  });

  it("does not change the saved order when sorting", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Sort by"),
      "Highest amount",
    );

    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    expect(saved).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Groceries" })]),
    );
    expect(Array.isArray(saved) && saved[0]).toMatchObject({
      title: "Groceries",
    });
  });
});
