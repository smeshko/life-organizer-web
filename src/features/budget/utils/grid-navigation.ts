import type { BudgetPlanEntry } from "@/api/types"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export function buildCellGrid(entries: BudgetPlanEntry[]): string[] {
  const cells: string[] = []
  for (const entry of entries) {
    for (const month of MONTHS) {
      cells.push(`${entry.type}-${entry.category}-${month}`)
    }
  }
  return cells
}

export function getNextCell(
  currentCellId: string,
  direction: "right" | "left" | "down",
  grid: string[],
): string | null {
  const currentIndex = grid.indexOf(currentCellId)
  if (currentIndex === -1) return null

  if (direction === "right") {
    const nextIndex = currentIndex + 1
    return nextIndex < grid.length ? grid[nextIndex] : null
  }

  if (direction === "left") {
    const prevIndex = currentIndex - 1
    return prevIndex >= 0 ? grid[prevIndex] : null
  }

  // direction === "down": same month, next category (12 cells per row)
  const nextIndex = currentIndex + 12
  return nextIndex < grid.length ? grid[nextIndex] : null
}
