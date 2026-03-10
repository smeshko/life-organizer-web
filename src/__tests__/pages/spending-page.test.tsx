import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { SpendingPage } from "@/pages/spending-page"

describe("SpendingPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <SpendingPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Category Spending")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    render(
      <MemoryRouter>
        <SpendingPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByText("Category spending coming soon"),
    ).toBeInTheDocument()
  })
})
