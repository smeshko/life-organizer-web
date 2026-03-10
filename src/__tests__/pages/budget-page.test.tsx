import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilterProvider } from "@/contexts/filter-context"
import { BudgetPage } from "@/pages/budget-page"
import { vi, beforeEach } from "vitest"
import type { BudgetPlan } from "@/api/types"

const mockBudgetPlan: BudgetPlan = {
  year: 2026,
  entries: [
    {
      category: "Salary",
      type: "income",
      amounts: { 1: 3000, 2: 3000, 3: 3200 },
    },
    {
      category: "Freelance",
      type: "income",
      amounts: { 1: 500, 2: 0, 3: 800 },
    },
    {
      category: "Rent",
      type: "expense",
      amounts: { 1: 1200, 2: 1200, 3: 1200 },
    },
    {
      category: "Emergency Fund",
      type: "savings",
      amounts: { 1: 500, 2: 500, 3: 500 },
    },
  ],
}

const emptyBudgetPlan: BudgetPlan = {
  year: 2026,
  entries: [],
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
          <BudgetPage />
        </FilterProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("BudgetPage", () => {
  it("renders the page title", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {}),
    )

    renderPage()
    expect(screen.getByText("Budget Planning")).toBeInTheDocument()
  })

  it("shows skeleton loaders while fetching", () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {}),
    )

    renderPage()
    const skeletons = document.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("renders the budget grid with data after loading", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument()
    })

    expect(screen.getByText("Freelance")).toBeInTheDocument()
    expect(screen.getByText("Rent")).toBeInTheDocument()
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument()
  })

  it("renders section headers for income, expenses, and savings", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("INCOME")).toBeInTheDocument()
    })

    expect(screen.getByText("EXPENSES")).toBeInTheDocument()
    expect(screen.getByText("SAVINGS")).toBeInTheDocument()
  })

  it("renders month column headers", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Jan")).toBeInTheDocument()
    })

    expect(screen.getByText("Feb")).toBeInTheDocument()
    expect(screen.getByText("Dec")).toBeInTheDocument()
  })

  it("renders To Allocate row", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("To Allocate")).toBeInTheDocument()
    })
  })

  it("shows dash for zero/empty amounts", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument()
    })

    // Freelance has 0 for Feb, so should show dashes
    const dashes = screen.getAllByText("—")
    expect(dashes.length).toBeGreaterThan(0)
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
        json: () => Promise.resolve(mockBudgetPlan),
      })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument()
    })

    const retryButton = screen.getByRole("button", { name: "Retry" })
    await userEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument()
    })
  })

  it("shows empty state when no entries exist", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(emptyBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText("No budget plan for 2026. Create one to get started."),
      ).toBeInTheDocument()
    })
  })

  it("renders a semantic HTML table", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument()
    })

    expect(document.querySelector("table")).toBeInTheDocument()
    expect(document.querySelector("thead")).toBeInTheDocument()
    expect(document.querySelector("tbody")).toBeInTheDocument()
  })
})
