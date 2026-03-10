import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"

export interface ChartContainerProps {
  title: string
  isLoading: boolean
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
  className?: string
}

function ChartContainerSkeleton() {
  return (
    <div className="flex items-start gap-[var(--space-6)]">
      <LoadingSkeleton variant="chart" />
      <div className="flex flex-1 flex-col gap-[var(--space-2)] pt-[var(--space-2)]">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-hover)]"
          />
        ))}
      </div>
    </div>
  )
}

function ChartContainer({
  title,
  isLoading,
  isEmpty,
  emptyMessage,
  children,
  className,
}: ChartContainerProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-[var(--space-6)]",
        className,
      )}
    >
      <h2 className="mb-[var(--space-4)] font-sans text-sm font-medium text-[var(--text-secondary)]">
        {title}
      </h2>

      {isLoading && <ChartContainerSkeleton />}
      {!isLoading && isEmpty && <EmptyState message={emptyMessage} />}
      {!isLoading && !isEmpty && children}
    </section>
  )
}

export { ChartContainer }
