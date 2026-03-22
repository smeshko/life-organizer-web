import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayout } from "@/components/layout/app-layout"
import { vi, beforeEach } from "vitest"

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        period: { year: 2026, month: null },
        aggregations: [],
      }),
  })
})

function renderLayout(initialRoute = "/transactions") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider defaultTheme="dark">
          <FilterProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route
                  path="transactions"
                  element={<div>Transactions Content</div>}
                />
                <Route path="budget" element={<div>Budget Content</div>} />
              </Route>
            </Routes>
          </FilterProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("AppLayout", () => {
  it("renders the sidebar", () => {
    renderLayout()
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument()
  })

  it("renders child route content via Outlet", () => {
    renderLayout()
    expect(screen.getByText("Transactions Content")).toBeInTheDocument()
  })

  it("does not apply max-width constraint", () => {
    renderLayout("/transactions")
    const content = screen.getByTestId("content-area")
    expect(content).not.toHaveStyle({ maxWidth: "1200px" })
  })

  it("removes max-width for /budget route", () => {
    renderLayout("/budget")
    const content = screen.getByTestId("content-area")
    expect(content).not.toHaveStyle({ maxWidth: "1200px" })
  })

  it("shows expanded sidebar on all routes", () => {
    const { container } = renderLayout("/budget")
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "240px" })
  })

  it("shows quick-stats on all routes", () => {
    renderLayout("/budget")
    expect(screen.getByText(/AT A GLANCE/)).toBeInTheDocument()
  })
})
