import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
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
        <ThemeProvider defaultTheme="dark">
          <AppRoutes />
        </ThemeProvider>
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

  it("redirects /budget to /transactions", () => {
    renderWithRouter("/budget")
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument()
    const requestedUrls = vi.mocked(globalThis.fetch).mock.calls.map((c) => String(c[0]))
    expect(requestedUrls.some((url) => url.includes("/budget/plan"))).toBe(false)
  })

  it("redirects /budget-vs-actual to /transactions", () => {
    renderWithRouter("/budget-vs-actual")
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Budget vs Actual" })).not.toBeInTheDocument()
  })

  it("preserves /design-system route outside layout", () => {
    renderWithRouter("/design-system")
    expect(
      screen.getByText("Quiet Ledger Design System"),
    ).toBeInTheDocument()
  })
})
