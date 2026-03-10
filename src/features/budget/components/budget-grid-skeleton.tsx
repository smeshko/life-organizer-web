const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const SKELETON_ROWS = 8

export function BudgetGridSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="sticky left-0 z-10 bg-[var(--bg-root)] px-[var(--space-3)] py-[var(--space-2)] text-left text-sm text-[var(--text-secondary)]">
              Category
            </th>
            {MONTH_LABELS.map((label) => (
              <th
                key={label}
                className="px-[var(--space-3)] py-[var(--space-2)] text-right"
                style={{ fontSize: "11px", color: "var(--text-tertiary)" }}
              >
                {label}
              </th>
            ))}
            <th
              className="px-[var(--space-3)] py-[var(--space-2)] text-right"
              style={{ fontSize: "11px", color: "var(--text-tertiary)" }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <tr key={i}>
              <td className="sticky left-0 z-10 bg-[var(--bg-root)] px-[var(--space-3)] py-[var(--space-2)]">
                <div className="h-4 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]" />
              </td>
              {MONTH_LABELS.map((_, j) => (
                <td key={j} className="px-[var(--space-3)] py-[var(--space-2)]">
                  <div className="ml-auto h-4 w-14 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]" />
                </td>
              ))}
              <td className="px-[var(--space-3)] py-[var(--space-2)]">
                <div className="ml-auto h-4 w-16 animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
