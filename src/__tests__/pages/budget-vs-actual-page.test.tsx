import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { BudgetVsActualPage } from "@/pages/budget-vs-actual-page"

describe("BudgetVsActualPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <BudgetVsActualPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Budget vs Actual")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    render(
      <MemoryRouter>
        <BudgetVsActualPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByText("Budget vs actual coming soon"),
    ).toBeInTheDocument()
  })
})
