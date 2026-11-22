import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("adds a dollar sign and two decimals", () => {
    expect(formatCurrency(12.5)).toBe("$12.50");
  });

  it("formats zero as $0.00", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("adds commas to thousands", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("rounds to two decimals", () => {
    expect(formatCurrency(10.0833)).toBe("$10.08");
  });
});
