import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { FilterProvider } from "@/contexts/filter-context"
import { BudgetVsActualPage } from "@/pages/budget-vs-actual-page"

function renderPage() {
  return render(
    <MemoryRouter>
      <FilterProvider>
        <BudgetVsActualPage />
      </FilterProvider>
    </MemoryRouter>,
  )
}

describe("BudgetVsActualPage", () => {
  it("renders the page title", () => {
    renderPage()
    expect(screen.getByText("Budget vs Actual")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    renderPage()
    expect(
      screen.getByText("Budget vs actual coming soon"),
    ).toBeInTheDocument()
  })
})
