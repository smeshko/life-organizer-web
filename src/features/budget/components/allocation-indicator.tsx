import { formatCurrency } from "@/lib/format"

interface AllocationIndicatorProps {
  /** Array of 12 monthly allocation values (Income - Expenses - Savings) */
  allocations: number[]
}

function getAllocationColor(value: number): string {
  if (value > 0) return "var(--income-300)"
  if (value < 0) return "var(--expense-300)"
  return "var(--text-tertiary)"
}

export function AllocationIndicator({ allocations }: AllocationIndicatorProps) {
  const annualTotal = allocations.reduce((sum, v) => sum + v, 0)

  return (
    <tr className="bg-[var(--bg-raised)] font-bold">
      <td className="sticky left-0 z-10 bg-[var(--bg-raised)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--text-primary)]">
        To Allocate
      </td>
      {allocations.map((value, i) => (
        <td
          key={i}
          className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs"
          style={{ color: getAllocationColor(value) }}
        >
          {value === 0
            ? "—"
            : formatCurrency(value, value < 0 ? "expense" : undefined)}
        </td>
      ))}
      <td
        className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs"
        style={{ color: getAllocationColor(annualTotal) }}
      >
        {annualTotal === 0
          ? "—"
          : formatCurrency(
              annualTotal,
              annualTotal < 0 ? "expense" : undefined,
            )}
      </td>
    </tr>
  )
}
