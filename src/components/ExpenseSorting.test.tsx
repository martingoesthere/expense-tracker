import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpenseSorting } from "./ExpenseSorting";

describe("ExpenseSorting", () => {
  it("shows the four sort options", () => {
    render(<ExpenseSorting value="newest" onChange={vi.fn()} />);

    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(
      screen.getByRole("option", { name: "Highest amount" }),
    ).toBeInTheDocument();
  });

  it("shows the chosen option as selected", () => {
    render(<ExpenseSorting value="highest" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Sort by")).toHaveValue("highest");
  });

  it("calls onChange with the option the user picks", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ExpenseSorting value="newest" onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText("Sort by"), "Lowest amount");

    expect(handleChange).toHaveBeenCalledWith("lowest");
  });
});
