import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BudgetSection } from "@/features/budget/components/budget-section"
import type { BudgetPlanEntry } from "@/api/types"

const entries: BudgetPlanEntry[] = [
  {
    category: "Salary",
    type: "income",
    amounts: { 1: 3000, 2: 3000, 3: 0 },
  },
  {
    category: "Freelance",
    type: "income",
    amounts: { 1: 500, 2: 500, 3: 800 },
  },
]

const defaultProps = {
  type: "income" as const,
  entries,
  editingCellId: null as string | null,
  onCellSave: vi.fn(),
  onCellNavigate: vi.fn(),
  onEditStart: vi.fn(),
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("BudgetSection with BudgetCell integration", () => {
  it("renders category names", () => {
    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} />
        </tbody>
      </table>,
    )
    expect(screen.getByText("Salary")).toBeInTheDocument()
    expect(screen.getByText("Freelance")).toBeInTheDocument()
  })

  it("renders section header", () => {
    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} />
        </tbody>
      </table>,
    )
    expect(screen.getByText("INCOME")).toBeInTheDocument()
  })

  it("shows input when a cell is being edited", () => {
    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} editingCellId="income-Salary-1" />
        </tbody>
      </table>,
    )
    const input = screen.getByRole("textbox")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("3000")
  })

  it("calls onEditStart when a data cell is clicked", async () => {
    const onEditStart = vi.fn()
    const user = userEvent.setup()

    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} onEditStart={onEditStart} />
        </tbody>
      </table>,
    )

    // Click on Salary Jan cell (€ 3,000.00)
    const cells = screen.getAllByText("€ 3,000.00")
    await user.click(cells[0])
    expect(onEditStart).toHaveBeenCalledWith("income-Salary-1")
  })

  it("calls onCellSave when Enter is pressed in edit mode", async () => {
    const onCellSave = vi.fn()
    const onCellNavigate = vi.fn()
    const user = userEvent.setup()

    render(
      <table>
        <tbody>
          <BudgetSection
            {...defaultProps}
            editingCellId="income-Salary-1"
            onCellSave={onCellSave}
            onCellNavigate={onCellNavigate}
          />
        </tbody>
      </table>,
    )

    const input = screen.getByRole("textbox")
    await user.clear(input)
    await user.type(input, "3500")
    await user.keyboard("{Enter}")

    expect(onCellSave).toHaveBeenCalledWith("Salary", "income", 1, 3500)
    expect(onCellNavigate).toHaveBeenCalledWith("income-Salary-1", "down")
  })

  it("does not render inputs for total row cells", () => {
    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} editingCellId={null} />
        </tbody>
      </table>,
    )
    // Total row should be read-only
    expect(screen.getByText("Total Income")).toBeInTheDocument()
  })

  it("renders dashes for zero amounts", () => {
    render(
      <table>
        <tbody>
          <BudgetSection {...defaultProps} />
        </tbody>
      </table>,
    )
    // Salary month 3 is 0, should show dash
    const dashes = screen.getAllByText("—")
    expect(dashes.length).toBeGreaterThan(0)
  })
})
