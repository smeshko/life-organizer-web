import { render, screen } from "@testing-library/react"
import { Header } from "@/components/layout/header"
import { FilterProvider } from "@/contexts/filter-context"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function renderHeader(title = "Transactions") {
  return render(
    <FilterProvider>
      <Header title={title} />
    </FilterProvider>,
  )
}

describe("Header", () => {
  it("renders the page title", () => {
    renderHeader("Transactions")
    expect(screen.getByText("Transactions")).toBeInTheDocument()
  })

  it("renders the title with serif font styling", () => {
    renderHeader("Budget Planning")
    const title = screen.getByText("Budget Planning")
    expect(title.closest("h1")).toHaveClass("font-serif")
  })

  it("renders year and period selectors", () => {
    renderHeader()
    expect(screen.getByLabelText("Year")).toBeInTheDocument()
    expect(screen.getByLabelText("Period")).toBeInTheDocument()
  })

  it("displays current year as default value in year selector", () => {
    renderHeader()
    const currentYear = String(new Date().getFullYear())
    const yearTrigger = screen.getByLabelText("Year")
    expect(yearTrigger).toHaveTextContent(currentYear)
  })

  it("displays current month name as default value in period selector", () => {
    renderHeader()
    const currentMonthName = MONTH_NAMES[new Date().getMonth()]
    const periodTrigger = screen.getByLabelText("Period")
    expect(periodTrigger).toHaveTextContent(currentMonthName)
  })

  it("year selector has combobox role for accessibility", () => {
    renderHeader()
    const yearTrigger = screen.getByLabelText("Year")
    expect(yearTrigger).toHaveAttribute("role", "combobox")
  })

  it("period selector has combobox role for accessibility", () => {
    renderHeader()
    const periodTrigger = screen.getByLabelText("Period")
    expect(periodTrigger).toHaveAttribute("role", "combobox")
  })
})
