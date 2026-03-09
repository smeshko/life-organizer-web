import { cn } from "@/lib/utils"

function getColorClass(percentage: number): string {
  if (percentage > 100) return "bg-[var(--expense-400)]"
  if (percentage >= 80) return "bg-[var(--income-400)]"
  return "bg-[var(--savings-400)]"
}

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number
}

function ProgressBar({ percentage, className, ...props }: ProgressBarProps) {
  const clampedWidth = Math.max(0, Math.min(percentage, 100))

  return (
    <div
      className={cn(
        "h-[6px] overflow-hidden rounded-[3px] bg-[var(--bg-hover)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-[3px] transition-[width] duration-300 ease-out",
          getColorClass(percentage),
        )}
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps }
