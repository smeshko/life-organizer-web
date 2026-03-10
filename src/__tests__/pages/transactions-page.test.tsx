import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { TransactionsPage } from "@/pages/transactions-page"

describe("TransactionsPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("renders placeholder body text", () => {
    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Transactions coming soon")).toBeInTheDocument()
  })
})
