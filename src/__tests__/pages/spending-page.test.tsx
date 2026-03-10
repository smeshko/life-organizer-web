import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { SpendingPage } from "@/pages/spending-page"
import { vi, beforeEach } from "vitest"
import type { CategoryBreakdown } from "@/api/types"

// Recharts ResponsiveContainer needs dimensions — mock it
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({
      children,
    }: {
      children: React.ReactNode
    }) => <div style={{ width: 180, height: 180 }}>{children}</div>,
  }
})

const mockIncomeData: CategoryBreakdown[] = [
  { category: "Salary", amount: 3000, percentage: 75 },
  { category: "Freelance", amount: 1000, percentage: 25 },
]

const mockExpenseData: CategoryBreakdown[] = [
  { category: "Groceries", amount: 500, percentage: 50 },
  { category: "Rent", amount: 300, percentage: 30 },
  { category: "Transport", amount: 200, percentage: 20 },
]

const mockSavingsData: CategoryBreakdown[] = [
  { category: "Emergency Fund", amount: 500, percentage: 100 },
]

function mockFetchResponses(
  income: CategoryBreakdown[],
  expense: CategoryBreakdown[],
  savings: CategoryBreakdown[],
) {
  ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
    (url: string) => {
      if (typeof url === "string" && url.includes("type=income")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(income),
        })
      }
      if (typeof url === "string" && url.includes("type=expense")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(expense),
        })
      }
      if (typeof url === "string" && url.includes("type=savings")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(savings),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })
    },
  )
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <FilterProvider>
          <SpendingPage />
        </FilterProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("SpendingPage", () => {
  it("renders the page title 'Category Spending'", () => {
    mockFetchResponses(mockIncomeData, mockExpenseData, mockSavingsData)
    renderPage()
    expect(screen.getByText("Category Spending")).toBeInTheDocument()
  })

  it("renders 3 chart sections: Income, Expenses, Savings", async () => {
    mockFetchResponses(mockIncomeData, mockExpenseData, mockSavingsData)
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Income")).toBeInTheDocument()
    })

    expect(screen.getByText("Expenses")).toBeInTheDocument()
    expect(screen.getByText("Savings")).toBeInTheDocument()
  })

  it("shows category data in legends after loading", async () => {
    mockFetchResponses(mockIncomeData, mockExpenseData, mockSavingsData)
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument()
    })

    expect(screen.getByText("Freelance")).toBeInTheDocument()
    expect(screen.getByText("Groceries")).toBeInTheDocument()
    expect(screen.getByText("Rent")).toBeInTheDocument()
    expect(screen.getByText("Transport")).toBeInTheDocument()
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument()
  })

  it("shows empty state when a type has no data", async () => {
    mockFetchResponses([], mockExpenseData, [])
    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText("No income data for this period"),
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText("No savings data for this period"),
    ).toBeInTheDocument()

    // Expenses should still have data
    expect(screen.getByText("Groceries")).toBeInTheDocument()
  })

  it("shows loading skeletons while data is fetching", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    )

    renderPage()

    const skeletons = document.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("shows error state when API fails", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Server error" }),
    })

    renderPage()

    await waitFor(() => {
      const errorMessages = screen.getAllByText("Server error")
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })
})
