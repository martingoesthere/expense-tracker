import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "./CategoryFilter";
import type { CategoryFilterValue } from "../types/expense";

function renderFilter(
  selected: CategoryFilterValue = "all",
  onChange = vi.fn(),
) {
  render(<CategoryFilter selected={selected} onChange={onChange} />);
  return { onChange };
}

describe("CategoryFilter", () => {
  it('shows an "all" button plus one button for each category', () => {
    renderFilter();

    expect(screen.getAllByRole("button")).toHaveLength(6);
    expect(screen.getByRole("button", { name: "all" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "food" })).toBeInTheDocument();
  });

  it("marks only the selected option as pressed", () => {
    renderFilter("food");

    expect(screen.getByRole("button", { name: "food" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "all" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the category that was clicked", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter();

    await user.click(screen.getByRole("button", { name: "transport" }));

    expect(onChange).toHaveBeenCalledWith("transport");
  });

  it('calls onChange with "all" when the all button is clicked', async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter("fun");

    await user.click(screen.getByRole("button", { name: "all" }));

    expect(onChange).toHaveBeenCalledWith("all");
  });
});
