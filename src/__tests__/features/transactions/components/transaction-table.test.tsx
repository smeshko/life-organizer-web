import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TransactionTable } from "@/features/transactions/components/transaction-table"
import type { Transaction } from "@/api/types"

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-03-01",
    type: "income",
    category: "Salary",
    amount: 3000,
    details: "Monthly salary",
  },
  {
    id: "2",
    date: "2026-03-05",
    type: "expense",
    category: "Groceries",
    amount: 150.5,
    details: "Weekly groceries",
  },
  {
    id: "3",
    date: "2026-03-10",
    type: "savings",
    category: "Emergency Fund",
    amount: 500,
    details: "Monthly savings",
  },
]

const defaultSortProps = {
  sortBy: "date" as const,
  sortOrder: "desc" as const,
  onSortChange: vi.fn(),
}

describe("TransactionTable", () => {
  it("renders the card header with title and count", () => {
    render(<TransactionTable transactions={mockTransactions} total={10} {...defaultSortProps} />)

    expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    expect(screen.getByText("Showing 3 of 10")).toBeInTheDocument()
  })

  it("renders table column headers", () => {
    render(<TransactionTable transactions={mockTransactions} total={3} {...defaultSortProps} />)

    expect(screen.getByText("Date")).toBeInTheDocument()
    expect(screen.getByText("Type")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Details")).toBeInTheDocument()
    expect(screen.getByText("Amount")).toBeInTheDocument()
  })

  it("renders transaction data rows", () => {
    render(<TransactionTable transactions={mockTransactions} total={3} {...defaultSortProps} />)

    expect(screen.getByText("Mar 01")).toBeInTheDocument()
    expect(screen.getByText("Monthly salary")).toBeInTheDocument()
    expect(screen.getByText("Salary")).toBeInTheDocument()
  })

  it("renders TypeBadge with correct labels", () => {
    render(<TransactionTable transactions={mockTransactions} total={3} {...defaultSortProps} />)

    expect(screen.getByText("Income")).toBeInTheDocument()
    expect(screen.getByText("Expense")).toBeInTheDocument()
    expect(screen.getByText("Savings")).toBeInTheDocument()
  })

  it("formats amounts with correct currency formatting", () => {
    render(<TransactionTable transactions={mockTransactions} total={3} {...defaultSortProps} />)

    expect(screen.getByText("€ 3,000.00")).toBeInTheDocument()
    expect(screen.getByText("\u2212€ 150.50")).toBeInTheDocument()
    expect(screen.getByText("€ 500.00")).toBeInTheDocument()
  })

  it("applies correct color classes for amount types", () => {
    render(<TransactionTable transactions={mockTransactions} total={3} {...defaultSortProps} />)

    const incomeAmount = screen.getByText("€ 3,000.00")
    expect(incomeAmount.className).toContain("text-[var(--income-300)]")

    const expenseAmount = screen.getByText("\u2212€ 150.50")
    expect(expenseAmount.className).toContain("text-[var(--expense-300)]")

    const savingsAmount = screen.getByText("€ 500.00")
    expect(savingsAmount.className).toContain("text-[var(--savings-300)]")
  })

  it("renders an empty table when no transactions", () => {
    render(<TransactionTable transactions={[]} total={0} {...defaultSortProps} />)

    expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    expect(screen.getByText("Showing 0 of 0")).toBeInTheDocument()
  })

  it("calls onSortChange with 'date' when Date header is clicked", async () => {
    const onSortChange = vi.fn()
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={3}
        sortBy="date"
        sortOrder="desc"
        onSortChange={onSortChange}
      />,
    )

    await userEvent.click(screen.getByText("Date"))
    expect(onSortChange).toHaveBeenCalledWith("date")
  })

  it("calls onSortChange with 'amount' when Amount header is clicked", async () => {
    const onSortChange = vi.fn()
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={3}
        sortBy="date"
        sortOrder="desc"
        onSortChange={onSortChange}
      />,
    )

    await userEvent.click(screen.getByText("Amount"))
    expect(onSortChange).toHaveBeenCalledWith("amount")
  })

  it("shows sort arrow on active sort column (date desc)", () => {
    const { container } = render(
      <TransactionTable
        transactions={mockTransactions}
        total={3}
        sortBy="date"
        sortOrder="desc"
        onSortChange={vi.fn()}
      />,
    )

    // The Date header should have a sort indicator (ArrowDown for desc)
    const dateHeader = screen.getByText("Date").closest("th")
    expect(dateHeader?.querySelector("svg")).toBeTruthy()

    // Amount header should NOT have a sort indicator
    const amountHeader = screen.getByText("Amount").closest("th")
    expect(amountHeader?.querySelector("svg")).toBeFalsy()
  })

  it("shows ArrowUp on active sort column when order is asc", () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={3}
        sortBy="date"
        sortOrder="asc"
        onSortChange={vi.fn()}
      />,
    )

    const dateHeader = screen.getByText("Date").closest("th")
    expect(dateHeader?.querySelector("svg")).toBeTruthy()
  })

  it("renders showing range format with page and pageSize props", () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={312}
        page={1}
        pageSize={50}
        {...defaultSortProps}
      />,
    )

    expect(screen.getByText("Showing 1–50 of 312")).toBeInTheDocument()
  })

  it("renders correct range on later pages", () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={312}
        page={2}
        pageSize={50}
        {...defaultSortProps}
      />,
    )

    expect(screen.getByText("Showing 51–100 of 312")).toBeInTheDocument()
  })

  it("clamps end of range to total on last page", () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        total={120}
        page={3}
        pageSize={50}
        {...defaultSortProps}
      />,
    )

    expect(screen.getByText("Showing 101–120 of 120")).toBeInTheDocument()
  })
})
