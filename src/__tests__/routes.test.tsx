import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { AppRoutes } from "@/routes"

function renderWithRouter(initialRoute: string) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe("AppRoutes", () => {
  it("redirects / to /transactions", () => {
    renderWithRouter("/")
    expect(
      screen.getByText("Transactions coming soon"),
    ).toBeInTheDocument()
  })

  it("renders transactions page at /transactions", () => {
    renderWithRouter("/transactions")
    expect(
      screen.getByText("Transactions coming soon"),
    ).toBeInTheDocument()
  })

  it("renders spending page at /spending", () => {
    renderWithRouter("/spending")
    expect(
      screen.getByText("Category spending coming soon"),
    ).toBeInTheDocument()
  })

  it("renders budget page at /budget", () => {
    renderWithRouter("/budget")
    expect(
      screen.getByText("Budget planning coming soon"),
    ).toBeInTheDocument()
  })

  it("renders budget vs actual page at /budget-vs-actual", () => {
    renderWithRouter("/budget-vs-actual")
    expect(
      screen.getByText("Budget vs actual coming soon"),
    ).toBeInTheDocument()
  })

  it("preserves /design-system route outside layout", () => {
    renderWithRouter("/design-system")
    expect(
      screen.getByText("Quiet Ledger Design System"),
    ).toBeInTheDocument()
  })
})
