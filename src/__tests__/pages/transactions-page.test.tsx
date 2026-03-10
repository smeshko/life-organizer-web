import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { TransactionsPage } from "@/pages/transactions-page"
import { vi, beforeEach } from "vitest"
import type { Transaction, PaginatedResponse } from "@/api/types"

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-03-01",
    type: "income",
    category: "Salary",
    amount: 3000,
    details: "Monthly salary",
  },
  {
    id: "2",
    date: "2026-03-05",
    type: "expense",
    category: "Groceries",
    amount: 150.5,
    details: "Weekly groceries",
  },
  {
    id: "3",
    date: "2026-03-10",
    type: "savings",
    category: "Emergency Fund",
    amount: 500,
    details: "Monthly savings",
  },
]

const mockResponse: PaginatedResponse<Transaction> = {
  data: mockTransactions,
  total: 3,
  page: 1,
  pageSize: 50,
  totalPages: 1,
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
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("shows loading skeletons while fetching", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {}),
    )

    renderPage()
    const skeletons = document.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("renders stat cards with correct totals after data loads", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText("€ 3,000.00").length).toBeGreaterThan(0)
    })

    expect(screen.getAllByText("Income").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Expenses").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Savings").length).toBeGreaterThan(0)
    expect(screen.getAllByText("\u2212€ 150.50").length).toBeGreaterThan(0)
    expect(screen.getAllByText("€ 500.00").length).toBeGreaterThan(0)
  })

  it("renders the transaction table with data", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

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
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Server error" }),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })

  it("retries fetching when retry button is clicked", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Server error" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      })

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
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          pageSize: 50,
          totalPages: 0,
        }),
    })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText("No transactions for this period."),
      ).toBeInTheDocument()
    })
  })

  it("renders type filter tabs with 'All' selected by default", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

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
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    const incomeTab = screen.getByRole("tab", { name: "Income" })
    await userEvent.click(incomeTab)

    // After clicking, the tab should be active and a new fetch should have been triggered
    await waitFor(() => {
      expect(incomeTab).toHaveAttribute("data-state", "active")
    })

    // Verify at least 2 fetch calls: initial + filtered
    expect(
      (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length,
    ).toBeGreaterThanOrEqual(2)
  })

  it("renders category filter button", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /categories/i }),
      ).toBeInTheDocument()
    })
  })

  it("shows categories from data in the category dropdown", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    // Open the categories dropdown
    const categoriesButton = screen.getByRole("button", { name: /categories/i })
    await userEvent.click(categoriesButton)

    // Verify checkboxes appear in the popover for each category
    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes.length).toBe(3) // Salary, Groceries, Emergency Fund
    })
  })

  it("renders date range inputs", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    expect(screen.getByLabelText("From")).toBeInTheDocument()
    expect(screen.getByLabelText("To")).toBeInTheDocument()
  })

  it("clicking a sortable column header triggers a re-fetch", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    // Click the Amount header to sort by amount
    await userEvent.click(screen.getByText("Amount"))

    await waitFor(() => {
      const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
      expect(calls.length).toBeGreaterThanOrEqual(2)
      const lastUrl = calls[calls.length - 1][0] as string
      expect(lastUrl).toContain("sortBy=amount")
    })
  })

  it("hides pagination when results are fewer than page size", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse), // 3 items, totalPages=1
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    })

    // Pagination should not be visible (totalPages=1)
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
  })

  it("shows pagination and navigates pages when more than 50 results", async () => {
    const paginatedResponse: PaginatedResponse<Transaction> = {
      data: mockTransactions,
      total: 120,
      page: 1,
      pageSize: 50,
      totalPages: 3,
    }

    const page2Response: PaginatedResponse<Transaction> = {
      data: mockTransactions,
      total: 120,
      page: 2,
      pageSize: 50,
      totalPages: 3,
    }

    ;(globalThis.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(paginatedResponse),
      })
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(page2Response),
      })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    })

    expect(screen.getByText("Showing 1–50 of 120")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled()

    // Click Next
    await userEvent.click(screen.getByRole("button", { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
    })
  })
})
