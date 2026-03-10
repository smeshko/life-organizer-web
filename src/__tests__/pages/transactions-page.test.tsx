import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { FilterProvider } from "@/contexts/filter-context"
import { TransactionsPage } from "@/pages/transactions-page"

function renderPage() {
  return render(
    <MemoryRouter>
      <FilterProvider>
        <TransactionsPage />
      </FilterProvider>
    </MemoryRouter>,
  )
}

describe("TransactionsPage", () => {
  it("renders the page title", () => {
    renderPage()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    renderPage()
    expect(screen.getByText("Transactions coming soon")).toBeInTheDocument()
  })
})
