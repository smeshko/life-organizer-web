import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { FilterProvider } from "@/contexts/filter-context"
import { BudgetPage } from "@/pages/budget-page"

function renderPage() {
  return render(
    <MemoryRouter>
      <FilterProvider>
        <BudgetPage />
      </FilterProvider>
    </MemoryRouter>,
  )
}

describe("BudgetPage", () => {
  it("renders the page title", () => {
    renderPage()
    expect(screen.getByText("Budget Planning")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    renderPage()
    expect(
      screen.getByText("Budget planning coming soon"),
    ).toBeInTheDocument()
  })
})
