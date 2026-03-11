const SECTIONS = ["Expenses", "Income", "Savings"]
const SKELETON_ROWS = 4
const COLUMNS = 6

export function BudgetVsActualSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      {SECTIONS.map((section) => (
        <div
          key={section}
          className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-[var(--space-4)]"
        >
          <div className="mb-[var(--space-3)] h-5 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]" />
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {Array.from({ length: COLUMNS }, (_, i) => (
                  <th key={i} className="px-2 py-2">
                    <div className="h-4 w-16 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <tr key={i}>
                  {Array.from({ length: COLUMNS }, (_, j) => (
                    <td key={j} className="px-2 py-2">
                      <div
                        className="h-4 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]"
                        style={{ width: j === 3 ? "100%" : j === 0 ? "80px" : "60px" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
