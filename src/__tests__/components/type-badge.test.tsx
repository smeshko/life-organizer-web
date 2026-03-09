import { render, screen } from "@testing-library/react"
import { TypeBadge } from "@/components/type-badge"

describe("TypeBadge", () => {
  it("renders children text", () => {
    render(<TypeBadge variant="income">Income</TypeBadge>)
    expect(screen.getByText("Income")).toBeInTheDocument()
  })

  it("renders income variant with correct classes", () => {
    render(<TypeBadge variant="income">Income</TypeBadge>)
    const badge = screen.getByText("Income")
    expect(badge).toHaveClass("text-[var(--income-300)]")
    expect(badge).toHaveClass("bg-[var(--income-bg-strong)]")
    expect(badge).toHaveClass("border-[var(--income-border)]")
  })

  it("renders expense variant with correct classes", () => {
    render(<TypeBadge variant="expense">Expense</TypeBadge>)
    const badge = screen.getByText("Expense")
    expect(badge).toHaveClass("text-[var(--expense-300)]")
    expect(badge).toHaveClass("bg-[var(--expense-bg-strong)]")
    expect(badge).toHaveClass("border-[var(--expense-border)]")
  })

  it("renders savings variant with correct classes", () => {
    render(<TypeBadge variant="savings">Savings</TypeBadge>)
    const badge = screen.getByText("Savings")
    expect(badge).toHaveClass("text-[var(--savings-300)]")
    expect(badge).toHaveClass("bg-[var(--savings-bg-strong)]")
    expect(badge).toHaveClass("border-[var(--savings-border)]")
  })

  it("applies custom className", () => {
    render(
      <TypeBadge variant="income" className="custom-class">
        Test
      </TypeBadge>,
    )
    expect(screen.getByText("Test")).toHaveClass("custom-class")
  })
})
