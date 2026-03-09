import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { DesignSystemPage } from "@/pages/design-system-page"

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/design-system"]}>
      <DesignSystemPage />
    </MemoryRouter>,
  )
}

describe("DesignSystemPage", () => {
  it("renders the main title", () => {
    renderPage()
    expect(
      screen.getByText("Quiet Ledger Design System"),
    ).toBeInTheDocument()
  })

  it("renders all major sections", () => {
    renderPage()
    expect(screen.getByText("Surface Palette")).toBeInTheDocument()
    expect(screen.getByText("Semantic Colors")).toBeInTheDocument()
    expect(screen.getByText("Chart Palette")).toBeInTheDocument()
    expect(screen.getByText("Typography")).toBeInTheDocument()
    expect(screen.getByText("Spacing")).toBeInTheDocument()
    expect(screen.getByText("Components")).toBeInTheDocument()
  })

  it("renders all 3 TypeBadge variants", () => {
    renderPage()
    // TypeBadge in the Components section (direct demos)
    const badges = screen.getAllByText(/^(Income|Expense|Savings)$/)
    // At least 3 from the TypeBadge demo section, plus more from the transaction table
    expect(badges.length).toBeGreaterThanOrEqual(3)
  })

  it("renders all 4 StatCard variants with sample data", () => {
    renderPage()
    expect(screen.getByText("Total Income")).toBeInTheDocument()
    expect(screen.getByText("Total Expenses")).toBeInTheDocument()
    expect(screen.getAllByText("€3,200.00").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("€2,180.50")).toBeInTheDocument()
    expect(screen.getByText("€850.00")).toBeInTheDocument()
    expect(screen.getByText("€169.50")).toBeInTheDocument()
    expect(screen.getByText("Balance")).toBeInTheDocument()
  })

  it("renders all 3 ProgressBar variants", () => {
    renderPage()
    expect(screen.getByText("Under budget")).toBeInTheDocument()
    expect(screen.getByText("Near budget")).toBeInTheDocument()
    expect(screen.getByText("Over budget")).toBeInTheDocument()
    expect(screen.getByText("45%")).toBeInTheDocument()
    expect(screen.getByText("92%")).toBeInTheDocument()
    expect(screen.getByText("118%")).toBeInTheDocument()
  })

  it("renders the sample transaction table with expected rows", () => {
    renderPage()
    expect(screen.getByText("March salary — Acme GmbH")).toBeInTheDocument()
    expect(screen.getByText("Monthly rent — Apartment")).toBeInTheDocument()
    expect(screen.getByText("REWE Supermarkt")).toBeInTheDocument()
    expect(
      screen.getByText("Monthly transfer — Emergency fund"),
    ).toBeInTheDocument()
    expect(screen.getByText("BVG Monthly Pass")).toBeInTheDocument()
  })

  it("renders ErrorState in the Components section", () => {
    renderPage()
    expect(
      screen.getByText("Failed to load transactions"),
    ).toBeInTheDocument()
    expect(screen.getByText("Retry")).toBeInTheDocument()
  })

  it("renders LoadingSkeleton variants", () => {
    renderPage()
    expect(screen.getByText("Card")).toBeInTheDocument()
    expect(screen.getByText("Table Row (3)")).toBeInTheDocument()
    expect(screen.getByText("Chart")).toBeInTheDocument()
  })

  it("renders EmptyState in the Components section", () => {
    renderPage()
    expect(
      screen.getByText("No transactions found for this period"),
    ).toBeInTheDocument()
  })

  it("renders surface palette color cards", () => {
    renderPage()
    expect(screen.getByText("--bg-root")).toBeInTheDocument()
    expect(screen.getByText("--bg-surface")).toBeInTheDocument()
    expect(screen.getByText("--bg-raised")).toBeInTheDocument()
    expect(screen.getByText("--bg-elevated")).toBeInTheDocument()
    expect(screen.getByText("--bg-hover")).toBeInTheDocument()
    expect(screen.getByText("--bg-active")).toBeInTheDocument()
  })

  it("renders chart palette with numbered labels", () => {
    renderPage()
    // Chart hex values may also appear in semantic colors, so use getAllByText
    expect(screen.getAllByText("#e4a83a").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("#d47b6e").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("#6daa7c").length).toBeGreaterThanOrEqual(1)
  })

  it("renders typography samples", () => {
    renderPage()
    expect(screen.getByText("Your Financial Story")).toBeInTheDocument()
    expect(screen.getByText("Monthly Overview")).toBeInTheDocument()
    expect(screen.getByText("Transaction History")).toBeInTheDocument()
    expect(screen.getByText("Category Breakdown")).toBeInTheDocument()
    expect(screen.getByText("€2,450.00")).toBeInTheDocument()
    expect(screen.getByText("TOTAL INCOME")).toBeInTheDocument()
  })

  it("renders spacing bars", () => {
    renderPage()
    expect(screen.getByText("--space-1 — 4px")).toBeInTheDocument()
    expect(screen.getByText("--space-16 — 64px")).toBeInTheDocument()
  })

  it("renders budget grid cell styles", () => {
    renderPage()
    expect(screen.getByText("Budget Grid Cells")).toBeInTheDocument()
    expect(screen.getByText("Remaining (positive)")).toBeInTheDocument()
    expect(screen.getByText("+€515.50")).toBeInTheDocument()
    expect(screen.getByText("Balanced (zero)")).toBeInTheDocument()
    expect(screen.getByText("Over-allocated (negative)")).toBeInTheDocument()
    expect(screen.getByText("–€120.00")).toBeInTheDocument()
  })
})
