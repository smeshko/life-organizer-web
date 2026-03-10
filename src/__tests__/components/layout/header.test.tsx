import { render, screen } from "@testing-library/react"
import { Header } from "@/components/layout/header"

describe("Header", () => {
  it("renders the page title", () => {
    render(<Header title="Transactions" />)
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("renders the title with serif font styling", () => {
    render(<Header title="Budget Planning" />)
    const title = screen.getByText("Budget Planning")
    expect(title.closest("h1")).toHaveClass("font-serif")
  })

  it("renders placeholder year and period selectors", () => {
    render(<Header title="Transactions" />)
    expect(screen.getByLabelText("Year")).toBeInTheDocument()
    expect(screen.getByLabelText("Period")).toBeInTheDocument()
  })
})
