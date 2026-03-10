import { render, screen } from "@testing-library/react"
import { Header } from "@/components/layout/header"
import { FilterProvider } from "@/contexts/filter-context"

function renderHeader(title = "Transactions") {
  return render(
    <FilterProvider>
      <Header title={title} />
    </FilterProvider>,
  )
}

describe("Header", () => {
  it("renders the page title", () => {
    renderHeader("Transactions")
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("renders the title with serif font styling", () => {
    renderHeader("Budget Planning")
    const title = screen.getByText("Budget Planning")
    expect(title.closest("h1")).toHaveClass("font-serif")
  })

  it("renders year and period selectors", () => {
    renderHeader()
    expect(screen.getByLabelText("Year")).toBeInTheDocument()
    expect(screen.getByLabelText("Period")).toBeInTheDocument()
  })
})
