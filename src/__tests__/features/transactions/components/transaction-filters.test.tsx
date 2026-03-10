import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TransactionFilters } from "@/features/transactions/components/transaction-filters"

const defaultProps = {
  type: "all" as const,
  categories: [] as string[],
  dateFrom: "2026-03-01",
  dateTo: "2026-03-31",
  availableCategories: ["Salary", "Groceries", "Emergency Fund"],
  onTypeChange: vi.fn(),
  onCategoriesChange: vi.fn(),
  onDateRangeChange: vi.fn(),
}

function renderFilters(overrides = {}) {
  const props = { ...defaultProps, ...overrides }
  return render(<TransactionFilters {...props} />)
}

describe("TransactionFilters", () => {
  it("renders type filter tabs with All selected by default", () => {
    renderFilters()

    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "data-state",
      "active",
    )
    expect(screen.getByRole("tab", { name: "Income" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Expenses" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Savings" })).toBeInTheDocument()
  })

  it("calls onTypeChange when a type tab is clicked", async () => {
    const onTypeChange = vi.fn()
    renderFilters({ onTypeChange })

    await userEvent.click(screen.getByRole("tab", { name: "Income" }))
    expect(onTypeChange).toHaveBeenCalledWith("income")
  })

  it("renders date range inputs with correct defaults", () => {
    renderFilters()

    const fromInput = screen.getByLabelText("From")
    const toInput = screen.getByLabelText("To")

    expect(fromInput).toHaveValue("2026-03-01")
    expect(toInput).toHaveValue("2026-03-31")
  })

  it("calls onDateRangeChange when date inputs change", async () => {
    const onDateRangeChange = vi.fn()
    renderFilters({ onDateRangeChange })

    const fromInput = screen.getByLabelText("From")
    await userEvent.clear(fromInput)
    await userEvent.type(fromInput, "2026-03-05")

    expect(onDateRangeChange).toHaveBeenCalled()
  })

  it("renders category filter button", () => {
    renderFilters()

    expect(
      screen.getByRole("button", { name: /categories/i }),
    ).toBeInTheDocument()
  })

  it("shows selected category count on the button", () => {
    renderFilters({ categories: ["Salary", "Groceries"] })

    expect(
      screen.getByRole("button", { name: /2 categories/i }),
    ).toBeInTheDocument()
  })

  it("calls onCategoriesChange when a category checkbox is toggled", async () => {
    const onCategoriesChange = vi.fn()
    renderFilters({ onCategoriesChange })

    // Open the popover
    await userEvent.click(
      screen.getByRole("button", { name: /categories/i }),
    )

    // Click a category checkbox
    const checkboxes = screen.getAllByRole("checkbox")
    await userEvent.click(checkboxes[0])

    expect(onCategoriesChange).toHaveBeenCalledWith(["Salary"])
  })

  it("calls onCategoriesChange with empty array when clear all is clicked", async () => {
    const onCategoriesChange = vi.fn()
    renderFilters({ onCategoriesChange, categories: ["Salary", "Groceries"] })

    // Open the popover
    await userEvent.click(
      screen.getByRole("button", { name: /2 categories/i }),
    )

    // Click clear all
    await userEvent.click(screen.getByText("Clear all"))

    expect(onCategoriesChange).toHaveBeenCalledWith([])
  })

  it("highlights active type tab", () => {
    renderFilters({ type: "expense" })

    expect(screen.getByRole("tab", { name: "Expenses" })).toHaveAttribute(
      "data-state",
      "active",
    )
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "data-state",
      "inactive",
    )
  })
})
