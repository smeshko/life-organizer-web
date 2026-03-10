import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { BudgetPage } from "@/pages/budget-page"

describe("BudgetPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <BudgetPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Budget Planning")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    render(
      <MemoryRouter>
        <BudgetPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByText("Budget planning coming soon"),
    ).toBeInTheDocument()
  })
})
