import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { vi, beforeEach } from "vitest"
import { AppRoutes } from "@/routes"

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}))
})

function renderWithRouter(initialRoute: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("AppRoutes", () => {
  it("redirects / to /transactions", () => {
    renderWithRouter("/")
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument()
  })

  it("renders transactions page at /transactions", () => {
    renderWithRouter("/transactions")
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument()
  })

  it("renders spending page at /spending", () => {
    renderWithRouter("/spending")
    expect(
      screen.getByRole("heading", { name: "Category Spending" }),
    ).toBeInTheDocument()
  })

  it("renders budget page at /budget", () => {
    renderWithRouter("/budget")
    expect(screen.getByText("Budget Planning")).toBeInTheDocument()
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
