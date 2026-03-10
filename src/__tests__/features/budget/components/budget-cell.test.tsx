import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BudgetCell } from "@/features/budget/components/budget-cell"

const defaultProps = {
  value: 1500,
  category: "Salary",
  month: 1,
  type: "income" as const,
  onSave: vi.fn(),
  onNavigate: vi.fn(),
  editingCellId: null as string | null,
  cellId: "income-Salary-1",
  onEditStart: vi.fn(),
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("BudgetCell", () => {
  describe("display mode", () => {
    it("renders formatted currency value", () => {
      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} />
            </tr>
          </tbody>
        </table>,
      )
      expect(screen.getByText("€ 1,500.00")).toBeInTheDocument()
    })

    it("renders em-dash for zero value", () => {
      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} value={0} />
            </tr>
          </tbody>
        </table>,
      )
      expect(screen.getByText("—")).toBeInTheDocument()
    })

    it("calls onEditStart when clicked", async () => {
      const user = userEvent.setup()
      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} />
            </tr>
          </tbody>
        </table>,
      )
      await user.click(screen.getByText("€ 1,500.00"))
      expect(defaultProps.onEditStart).toHaveBeenCalledWith("income-Salary-1")
    })
  })

  describe("edit mode", () => {
    it("shows input when editingCellId matches cellId", () => {
      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} editingCellId="income-Salary-1" />
            </tr>
          </tbody>
        </table>,
      )
      const input = screen.getByRole("textbox")
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue("1500")
    })

    it("does not show input when editingCellId does not match", () => {
      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} editingCellId="expense-Rent-1" />
            </tr>
          </tbody>
        </table>,
      )
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    })

    it("saves and navigates down on Enter", async () => {
      const onSave = vi.fn()
      const onNavigate = vi.fn()
      const user = userEvent.setup()

      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell
                {...defaultProps}
                editingCellId="income-Salary-1"
                onSave={onSave}
                onNavigate={onNavigate}
              />
            </tr>
          </tbody>
        </table>,
      )

      const input = screen.getByRole("textbox")
      await user.clear(input)
      await user.type(input, "2000")
      await user.keyboard("{Enter}")

      expect(onSave).toHaveBeenCalledWith(2000)
      expect(onNavigate).toHaveBeenCalledWith("down")
    })

    it("saves and navigates right on Tab", async () => {
      const onSave = vi.fn()
      const onNavigate = vi.fn()
      const user = userEvent.setup()

      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell
                {...defaultProps}
                editingCellId="income-Salary-1"
                onSave={onSave}
                onNavigate={onNavigate}
              />
            </tr>
          </tbody>
        </table>,
      )

      const input = screen.getByRole("textbox")
      await user.clear(input)
      await user.type(input, "2500")
      await user.tab()

      expect(onSave).toHaveBeenCalledWith(2500)
      expect(onNavigate).toHaveBeenCalledWith("right")
    })

    it("reverts on Escape", async () => {
      const onSave = vi.fn()
      const onNavigate = vi.fn()
      const user = userEvent.setup()

      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell
                {...defaultProps}
                editingCellId="income-Salary-1"
                onSave={onSave}
                onNavigate={onNavigate}
              />
            </tr>
          </tbody>
        </table>,
      )

      const input = screen.getByRole("textbox")
      await user.clear(input)
      await user.type(input, "9999")
      await user.keyboard("{Escape}")

      expect(onSave).not.toHaveBeenCalled()
      expect(onNavigate).toHaveBeenCalledWith("cancel")
    })

    it("rejects non-numeric input", async () => {
      const user = userEvent.setup()

      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell {...defaultProps} editingCellId="income-Salary-1" />
            </tr>
          </tbody>
        </table>,
      )

      const input = screen.getByRole("textbox")
      await user.clear(input)
      await user.type(input, "abc123.45xyz")

      expect(input).toHaveValue("123.45")
    })

    it("saves 0 when input is empty on Enter", async () => {
      const onSave = vi.fn()
      const user = userEvent.setup()

      render(
        <table>
          <tbody>
            <tr>
              <BudgetCell
                {...defaultProps}
                editingCellId="income-Salary-1"
                onSave={onSave}
              />
            </tr>
          </tbody>
        </table>,
      )

      const input = screen.getByRole("textbox")
      await user.clear(input)
      await user.keyboard("{Enter}")

      expect(onSave).toHaveBeenCalledWith(0)
    })
  })
})
