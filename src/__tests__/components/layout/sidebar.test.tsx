import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider, useFilter } from "@/contexts/filter-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { vi, beforeEach } from "vitest"

const mockAggregationResponse = {
  period: { year: 2026, month: null },
  aggregations: [],
}

const mockIncomeAggregation = {
  period: { year: 2026, month: 3 },
  aggregations: [
    { category: "Salary", total_eur: 4250, count: 1 },
  ],
}

const mockExpenseAggregation = {
  period: { year: 2026, month: 3 },
  aggregations: [
    { category: "Groceries", total_eur: 2847, count: 5 },
  ],
}

const mockSavingsAggregation = {
  period: { year: 2026, month: 3 },
  aggregations: [
    { category: "Emergency Fund", total_eur: 850, count: 1 },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockAggregationResponse),
  })
})

function renderSidebar(collapsed = false, initialRoute = "/transactions") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider defaultTheme="dark">
          <FilterProvider>
            <Sidebar collapsed={collapsed} />
          </FilterProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function PeriodSetter({ period }: { period: "total" | number }) {
  const { setPeriod } = useFilter()
  React.useEffect(() => {
    setPeriod(period as Parameters<typeof setPeriod>[0])
  }, [period, setPeriod])
  return null
}

function renderSidebarWithPeriod(period: "total" | number) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/transactions"]}>
        <ThemeProvider defaultTheme="dark">
          <FilterProvider>
            <PeriodSetter period={period} />
            <Sidebar collapsed={false} />
          </FilterProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("Sidebar", () => {
  it("renders the logo text when expanded", () => {
    renderSidebar(false)
    expect(screen.getByText("Life Organizer")).toBeInTheDocument()
  })

  it("hides the logo text when collapsed", () => {
    renderSidebar(true)
    expect(screen.queryByText("Life Organizer")).not.toBeInTheDocument()
  })

  it("renders the sage green dot", () => {
    const { container } = renderSidebar()
    const dot = container.querySelector("span.rounded-full")
    expect(dot).toBeInTheDocument()
  })

  it("renders main navigation with aria-label", () => {
    renderSidebar()
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument()
  })

  it("renders all 4 nav links with correct labels", () => {
    renderSidebar()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
    expect(screen.getByText("Spending")).toBeInTheDocument()
    expect(screen.getByText("Budget")).toBeInTheDocument()
    expect(screen.getByText("Budget vs Actual")).toBeInTheDocument()
  })

  it("hides nav labels when collapsed", () => {
    renderSidebar(true)
    expect(screen.queryByText("Transactions")).not.toBeInTheDocument()
    expect(screen.queryByText("Spending")).not.toBeInTheDocument()
  })

  it("shows tooltips on collapsed nav items", () => {
    renderSidebar(true)
    const links = screen.getAllByRole("link")
    expect(links[0]).toHaveAttribute("title", "Transactions")
    expect(links[1]).toHaveAttribute("title", "Spending")
    expect(links[2]).toHaveAttribute("title", "Budget")
    expect(links[3]).toHaveAttribute("title", "Budget vs Actual")
  })

  it("does not show tooltips when expanded", () => {
    renderSidebar(false)
    const links = screen.getAllByRole("link")
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("title")
    })
  })

  it("applies active styling to current route link", () => {
    renderSidebar(false, "/transactions")
    const link = screen.getByText("Transactions").closest("a")
    expect(link?.className).toContain("income-bg-strong")
  })

  it("applies inactive styling to non-current route links", () => {
    renderSidebar(false, "/transactions")
    const link = screen.getByText("Spending").closest("a")
    expect(link?.className).toContain("text-secondary")
  })

  it("sets sidebar width to 240px when expanded", () => {
    const { container } = renderSidebar(false)
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "240px" })
  })

  it("sets sidebar width to 52px when collapsed", () => {
    const { container } = renderSidebar(true)
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "52px" })
  })

  describe("Quick Stats", () => {
    it("renders dynamic glance header based on current month when expanded", () => {
      renderSidebar(false)
      const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
      ]
      const currentMonth = monthNames[new Date().getMonth()]
      expect(screen.getByText(`${currentMonth} AT A GLANCE`)).toBeInTheDocument()
    })

    it("renders dynamic stat amounts from API data", async () => {
      ;(globalThis.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockIncomeAggregation),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockExpenseAggregation),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockSavingsAggregation),
        })

      renderSidebar(false)

      await waitFor(() => {
        expect(screen.getByText("€ 4,250.00")).toBeInTheDocument()
      })
    })

    it("renders stat labels", () => {
      renderSidebar(false)
      expect(screen.getByText("INCOME")).toBeInTheDocument()
      expect(screen.getByText("SPENT")).toBeInTheDocument()
      expect(screen.getByText("SAVED")).toBeInTheDocument()
      expect(screen.getByText("REMAINING")).toBeInTheDocument()
    })

    it("hides quick-stats when collapsed", () => {
      renderSidebar(true)
      expect(screen.queryByText(/AT A GLANCE/)).not.toBeInTheDocument()
    })

    it("shows YEAR AT A GLANCE when period is total", () => {
      renderSidebarWithPeriod("total")
      expect(screen.getByText("YEAR AT A GLANCE")).toBeInTheDocument()
    })

    it("shows month name AT A GLANCE when period is a specific month", () => {
      renderSidebarWithPeriod(6)
      expect(screen.getByText("JUNE AT A GLANCE")).toBeInTheDocument()
    })
  })
})
