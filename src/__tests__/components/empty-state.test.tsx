import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/empty-state"

describe("EmptyState", () => {
  it("renders message text", () => {
    render(<EmptyState message="No data available" />)
    expect(screen.getByText("No data available")).toBeInTheDocument()
  })

  it("applies tertiary text color", () => {
    render(<EmptyState message="No data" />)
    expect(screen.getByText("No data")).toHaveClass(
      "text-[var(--text-tertiary)]",
    )
  })

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState message="No data" className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass("custom-class")
  })
})
