import { render, screen } from "@testing-library/react"
import { StatCard } from "@/components/stat-card"

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard type="income" label="Total Income" value="$1,200" />)
    expect(screen.getByText("Total Income")).toBeInTheDocument()
    expect(screen.getByText("$1,200")).toBeInTheDocument()
  })

  it("renders income type with correct accent border class", () => {
    const { container } = render(
      <StatCard type="income" label="Income" value="$500" />,
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("border-l-[var(--income-400)]")
  })

  it("renders expense type with correct accent border class", () => {
    const { container } = render(
      <StatCard type="expense" label="Expenses" value="$300" />,
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("border-l-[var(--expense-400)]")
  })

  it("renders savings type with correct accent border class", () => {
    const { container } = render(
      <StatCard type="savings" label="Savings" value="$200" />,
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("border-l-[var(--savings-400)]")
  })

  it("renders balance type with correct accent border class", () => {
    const { container } = render(
      <StatCard type="balance" label="Balance" value="$1,000" />,
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass("border-l-[var(--accent-400)]")
  })

  it("renders optional change text when provided", () => {
    render(
      <StatCard
        type="income"
        label="Income"
        value="$500"
        change="+12% from last month"
      />,
    )
    expect(screen.getByText("+12% from last month")).toBeInTheDocument()
  })

  it("does not render change text when not provided", () => {
    const { container } = render(
      <StatCard type="income" label="Income" value="$500" />,
    )
    const changeElements = container.querySelectorAll("[data-slot='change']")
    expect(changeElements).toHaveLength(0)
  })

  it("applies value color based on type", () => {
    render(<StatCard type="income" label="Income" value="$500" />)
    const value = screen.getByText("$500")
    expect(value).toHaveClass("text-[var(--income-300)]")
  })

  it("applies balance value color as text-primary", () => {
    render(<StatCard type="balance" label="Balance" value="$1,000" />)
    const value = screen.getByText("$1,000")
    expect(value).toHaveClass("text-[var(--text-primary)]")
  })
})
