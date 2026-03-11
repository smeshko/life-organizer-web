import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { ComparisonTable } from "@/features/budget-vs-actual/comparison-table"
import type { BudgetVsActualEntry } from "@/api/types"

const expenseEntries: BudgetVsActualEntry[] = [
  {
    category: "Rent",
    type: "expense",
    budgeted: 1200,
    actual: 1200,
    remaining: 0,
    excess: 0,
    percentComplete: 100,
  },
  {
    category: "Groceries",
    type: "expense",
    budgeted: 500,
    actual: 650,
    remaining: 0,
    excess: 150,
    percentComplete: 130,
  },
  {
    category: "Transport",
    type: "expense",
    budgeted: 200,
    actual: 120,
    remaining: 80,
    excess: 0,
    percentComplete: 60,
  },
]

const incomeEntries: BudgetVsActualEntry[] = [
  {
    category: "Salary",
    type: "income",
    budgeted: 3000,
    actual: 3000,
    remaining: 0,
    excess: 0,
    percentComplete: 100,
  },
]

const zeroBudgetEntry: BudgetVsActualEntry[] = [
  {
    category: "Bonus",
    type: "income",
    budgeted: 0,
    actual: 100,
    remaining: 0,
    excess: 100,
    percentComplete: 0,
  },
]

const mixedEntries: BudgetVsActualEntry[] = [
  ...expenseEntries,
  ...incomeEntries,
]

describe("ComparisonTable", () => {
  it("renders column headers", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Budget")).toBeInTheDocument()
    expect(screen.getByText("Actual")).toBeInTheDocument()
    expect(screen.getByText("%")).toBeInTheDocument()
    expect(screen.getByText("Remaining")).toBeInTheDocument()
  })

  it("filters entries by type", () => {
    render(<ComparisonTable entries={mixedEntries} type="expense" />)

    expect(screen.getByText("Rent")).toBeInTheDocument()
    expect(screen.getByText("Groceries")).toBeInTheDocument()
    expect(screen.getByText("Transport")).toBeInTheDocument()
    expect(screen.queryByText("Salary")).not.toBeInTheDocument()
  })

  it("sorts rows by overspend first (actual - budget descending)", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    const rows = screen.getAllByRole("row")
    // Row 0 is the header row
    // Row 1 should be Groceries (excess: 150, actual-budget = +150)
    // Row 2 should be Rent (actual-budget = 0)
    // Row 3 should be Transport (actual-budget = -80)
    const cellsRow1 = within(rows[1]).getAllByRole("cell")
    const cellsRow2 = within(rows[2]).getAllByRole("cell")
    const cellsRow3 = within(rows[3]).getAllByRole("cell")

    expect(cellsRow1[0]).toHaveTextContent("Groceries")
    expect(cellsRow2[0]).toHaveTextContent("Rent")
    expect(cellsRow3[0]).toHaveTextContent("Transport")
  })

  it("displays budget and actual amounts in currency format", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    // Groceries: budgeted 500, actual 650
    expect(screen.getByText("€ 500.00")).toBeInTheDocument()
    expect(screen.getByText("€ 650.00")).toBeInTheDocument()
  })

  it("displays percentage for categories", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    expect(screen.getByText("130%")).toBeInTheDocument()
    expect(screen.getByText("100%")).toBeInTheDocument()
    expect(screen.getByText("60%")).toBeInTheDocument()
  })

  it("shows dash for zero-budget categories", () => {
    render(<ComparisonTable entries={zeroBudgetEntry} type="income" />)

    expect(screen.getByText("—")).toBeInTheDocument()
  })

  it("displays remaining amount for under-budget categories", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    // Transport: remaining 80
    expect(screen.getByText("€ 80.00")).toBeInTheDocument()
  })

  it("displays excess amount with minus sign for over-budget categories", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    // Groceries: excess 150
    expect(screen.getByText("−€ 150.00")).toBeInTheDocument()
  })

  it("applies terracotta color class to over-budget remaining", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    const overBudgetAmount = screen.getByText("−€ 150.00")
    expect(overBudgetAmount.className).toContain("expense-400")
  })

  it("applies sage color class to under-budget remaining", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    const underBudgetAmount = screen.getByText("€ 80.00")
    expect(underBudgetAmount.className).toContain("income-400")
  })

  it("applies terracotta color to percentage when over 100%", () => {
    render(<ComparisonTable entries={expenseEntries} type="expense" />)

    const overPct = screen.getByText("130%")
    expect(overPct.className).toContain("expense-400")
  })

  it("renders empty table body when no entries match the type", () => {
    render(<ComparisonTable entries={expenseEntries} type="income" />)

    // Header row exists but no data rows
    const rows = screen.getAllByRole("row")
    expect(rows).toHaveLength(1) // only header
  })
})
