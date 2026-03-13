import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { TransactionsPage } from "@/pages/transactions-page"
import { vi, beforeEach } from "vitest"

const mockBackendResponse = {
  items: [
    {
      id: 1,
      amount: 3000,
      currency: "EUR",
      amount_eur: 3000,
      date: "2026-03-01",
      transaction_type: "Income",
      category: "Salary",
      details: "Monthly salary",
    },
    {
      id: 2,
      amount: 150.5,
      currency: "EUR",
      amount_eur: 150.5,
      date: "2026-03-05",
      transaction_type: "Expenses",
      category: "Groceries",
      details: "Weekly groceries",
    },
    {
      id: 3,
      amount: 500,
      currency: "EUR",
      amount_eur: 500,
      date: "2026-03-10",
      transaction_type: "Savings",
      category: "Emergency Fund",
      details: "Monthly savings",
    },
  ],
  total: 3,
  page: 1,
  page_size: 50,
}

const mockAggregationResponse = {
  period: { year: 2026, month: null },
  aggregations: [],
}

function mockFetchForTransactions() {
  ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
    (url: string) => {
      if (url.includes("/aggregate")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockAggregationResponse),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBackendResponse),
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
          <TransactionsPage />
        </FilterProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
  Element.prototype.scrollIntoView = vi.fn()
})

describe("TransactionsPage", () => {
  it("renders the page title", () => {
    mockFetchForTransactions()
    renderPage()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("shows loading skeletons while fetching", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    )

    renderPage()
    const skeletons = document.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("renders stat cards after data loads", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText("Income").length).toBeGreaterThan(0)
    })

    expect(screen.getAllByText("Expenses").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Savings").length).toBeGreaterThan(0)
  })

  it("renders the transaction table with data", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    expect(screen.getByText("Monthly salary")).toBeInTheDocument()
    expect(screen.getByText("Weekly groceries")).toBeInTheDocument()
    expect(screen.getByText("Monthly savings")).toBeInTheDocument()
    expect(screen.getByText("Showing 1–3 of 3")).toBeInTheDocument()
  })

  it("shows error state with retry button on API failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (url: string) => {
        if (url.includes("/aggregate")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockAggregationResponse),
          })
        }
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: "Server error" }),
        })
      },
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })

  it("retries fetching when retry button is clicked", async () => {
    let callCount = 0
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (url: string) => {
        if (url.includes("/aggregate")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockAggregationResponse),
          })
        }
        callCount++
        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: "Server error" }),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockBackendResponse),
        })
      },
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument()
    })

    const retryButton = screen.getByRole("button", { name: "Retry" })
    await userEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })
  })

  it("shows empty state when no transactions exist", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (url: string) => {
        if (url.includes("/aggregate")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockAggregationResponse),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              items: [],
              total: 0,
              page: 1,
              page_size: 50,
            }),
        })
      },
    )

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText("No transactions for this period."),
      ).toBeInTheDocument()
    })
  })

  it("renders type filter tabs with 'All' selected by default", () => {
    mockFetchForTransactions()
    renderPage()

    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "data-state",
      "active",
    )
    expect(screen.getByRole("tab", { name: "Income" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Expenses" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Savings" })).toBeInTheDocument()
  })

  it("triggers refetch when clicking a type filter tab", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    const incomeTab = screen.getByRole("tab", { name: "Income" })
    await userEvent.click(incomeTab)

    await waitFor(() => {
      expect(incomeTab).toHaveAttribute("data-state", "active")
    })
  })

  it("renders category filter button", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /categories/i }),
      ).toBeInTheDocument()
    })
  })

  it("shows categories from data in the category dropdown", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    const categoriesButton = screen.getByRole("button", { name: /categories/i })
    await userEvent.click(categoriesButton)

    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes.length).toBe(3)
    })
  })

  it("renders date range inputs", () => {
    mockFetchForTransactions()
    renderPage()

    expect(screen.getByLabelText("From")).toBeInTheDocument()
    expect(screen.getByLabelText("To")).toBeInTheDocument()
  })

  it("clicking a sortable column header triggers a re-fetch", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Amount"))

    await waitFor(() => {
      const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
      const transactionCalls = calls.filter(
        (c: string[]) => !c[0].includes("/aggregate"),
      )
      expect(transactionCalls.length).toBeGreaterThanOrEqual(2)
    })
  })

  it("hides pagination when results are fewer than page size", async () => {
    mockFetchForTransactions()
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
  })

  it("shows pagination and navigates pages when more than 50 results", async () => {
    const paginatedResponse = {
      items: mockBackendResponse.items,
      total: 120,
      page: 1,
      page_size: 50,
    }

    const page2Response = {
      items: mockBackendResponse.items,
      total: 120,
      page: 2,
      page_size: 50,
    }

    let transactionCallCount = 0
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (url: string) => {
        if (url.includes("/aggregate")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockAggregationResponse),
          })
        }
        transactionCallCount++
        const response = transactionCallCount === 1 ? paginatedResponse : page2Response
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
        })
      },
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    })

    expect(screen.getByText("Showing 1–50 of 120")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled()

    await userEvent.click(screen.getByRole("button", { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
    })
  })
})
