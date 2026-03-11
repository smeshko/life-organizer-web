import { describe, it, expect } from "vitest"
import {
  buildCellGrid,
  getNextCell,
} from "@/features/budget/utils/grid-navigation"
import type { BudgetPlanEntry } from "@/api/types"

const entries: BudgetPlanEntry[] = [
  { category: "Salary", type: "income", amounts: { 1: 3000, 2: 3000 } },
  { category: "Freelance", type: "income", amounts: { 1: 500, 2: 500 } },
  { category: "Rent", type: "expense", amounts: { 1: 1200, 2: 1200 } },
  { category: "Groceries", type: "expense", amounts: { 1: 400, 2: 400 } },
  {
    category: "Emergency Fund",
    type: "savings",
    amounts: { 1: 500, 2: 500 },
  },
]

describe("buildCellGrid", () => {
  it("returns flat list of cell IDs in row-major order", () => {
    const grid = buildCellGrid(entries)
    // 5 categories × 12 months = 60 cells
    expect(grid).toHaveLength(60)
    expect(grid[0]).toBe("income-Salary-1")
    expect(grid[11]).toBe("income-Salary-12")
    expect(grid[12]).toBe("income-Freelance-1")
    expect(grid[24]).toBe("expense-Rent-1")
    expect(grid[59]).toBe("savings-Emergency Fund-12")
  })

  it("returns empty array for empty entries", () => {
    expect(buildCellGrid([])).toHaveLength(0)
  })
})

describe("getNextCell", () => {
  const grid = buildCellGrid(entries)

  describe("right navigation", () => {
    it("moves to next month in same category", () => {
      expect(getNextCell("income-Salary-1", "right", grid)).toBe(
        "income-Salary-2",
      )
    })

    it("wraps to next category at month 12", () => {
      expect(getNextCell("income-Salary-12", "right", grid)).toBe(
        "income-Freelance-1",
      )
    })

    it("returns null at last cell", () => {
      expect(
        getNextCell("savings-Emergency Fund-12", "right", grid),
      ).toBeNull()
    })
  })

  describe("left navigation", () => {
    it("moves to previous month in same category", () => {
      expect(getNextCell("income-Salary-3", "left", grid)).toBe(
        "income-Salary-2",
      )
    })

    it("wraps to previous category at month 1", () => {
      expect(getNextCell("income-Freelance-1", "left", grid)).toBe(
        "income-Salary-12",
      )
    })

    it("returns null at first cell", () => {
      expect(getNextCell("income-Salary-1", "left", grid)).toBeNull()
    })
  })

  describe("down navigation", () => {
    it("moves to same month in next category", () => {
      expect(getNextCell("income-Salary-1", "down", grid)).toBe(
        "income-Freelance-1",
      )
    })

    it("crosses section boundaries", () => {
      expect(getNextCell("income-Freelance-5", "down", grid)).toBe(
        "expense-Rent-5",
      )
    })

    it("returns null at last category", () => {
      expect(
        getNextCell("savings-Emergency Fund-1", "down", grid),
      ).toBeNull()
    })
  })

  it("returns null for unknown cell", () => {
    expect(getNextCell("Unknown-1", "right", grid)).toBeNull()
  })
})
