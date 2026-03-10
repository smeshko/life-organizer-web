import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { FilterProvider } from "@/contexts/filter-context"
import { SpendingPage } from "@/pages/spending-page"

function renderPage() {
  return render(
    <MemoryRouter>
      <FilterProvider>
        <SpendingPage />
      </FilterProvider>
    </MemoryRouter>,
  )
}

describe("SpendingPage", () => {
  it("renders the page title", () => {
    renderPage()
    expect(screen.getByText("Category Spending")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    renderPage()
    expect(
      screen.getByText("Category spending coming soon"),
    ).toBeInTheDocument()
  })
})
