import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { BudgetVsActualPage } from "@/pages/budget-vs-actual-page"
import type { BudgetVsActualEntry } from "@/api/types"

vi.mock("@/api/budget-tracking", () => ({
  getBudgetVsActual: vi.fn(),
}))

import { getBudgetVsActual } from "@/api/budget-tracking"

const mockEntries: BudgetVsActualEntry[] = [
  {
    category: "Groceries",
    type: "expense",
    budgeted: 500,
    actual: 650,
    remaining: 0,
    excess: 150,
    percentComplete: 130,
  },
  {
    category: "Rent",
    type: "expense",
    budgeted: 1200,
    actual: 1000,
    remaining: 200,
    excess: 0,
    percentComplete: 83.33,
  },
  {
    category: "Salary",
    type: "income",
    budgeted: 3000,
    actual: 3000,
    remaining: 0,
    excess: 0,
    percentComplete: 100,
  },
  {
    category: "Emergency Fund",
    type: "savings",
    budgeted: 500,
    actual: 400,
    remaining: 100,
    excess: 0,
    percentComplete: 80,
  },
]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <FilterProvider>
          <BudgetVsActualPage />
        </FilterProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("BudgetVsActualPage", () => {
  it("renders the page title", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    renderPage()

    expect(screen.getByText("Budget vs Actual")).toBeInTheDocument()
  })

  it("shows skeleton loader while loading", () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    )

    renderPage()

    const skeletonElements = document.querySelectorAll(".animate-pulse")
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it("shows error state with retry button on fetch failure", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    )

    renderPage()

    expect(
      await screen.findByText("Network error"),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("retries fetch when retry button is clicked", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockEntries)

    renderPage()

    const retryButton = await screen.findByRole("button", { name: /retry/i })
    fireEvent.click(retryButton)

    // After retry succeeds, data should appear
    expect(await screen.findByText("Groceries")).toBeInTheDocument()
  })

  it("shows empty state when no data is returned", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce([])

    renderPage()

    const currentYear = new Date().getFullYear()
    expect(
      await screen.findByText(
        `No budget plan for ${currentYear}. Create one in Budget Planning.`,
      ),
    ).toBeInTheDocument()
  })

  it("renders all three section headers when data is present", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    renderPage()

    expect(await screen.findByText("Expenses")).toBeInTheDocument()
    expect(screen.getByText("Income")).toBeInTheDocument()
    expect(screen.getByText("Savings")).toBeInTheDocument()
  })

  it("renders expenses section first", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    renderPage()

    await screen.findByText("Expenses")

    const sectionHeaders = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent)

    expect(sectionHeaders[0]).toBe("Expenses")
    expect(sectionHeaders[1]).toBe("Income")
    expect(sectionHeaders[2]).toBe("Savings")
  })

  it("renders category names from data", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    renderPage()

    expect(await screen.findByText("Groceries")).toBeInTheDocument()
    expect(screen.getByText("Rent")).toBeInTheDocument()
    expect(screen.getByText("Salary")).toBeInTheDocument()
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument()
  })
})
