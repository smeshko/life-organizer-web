import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "card" | "table-row" | "chart"
  count?: number
}

function LoadingSkeleton({
  variant,
  count = 1,
  className,
  ...props
}: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={cn(
          "h-24 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-hover)]",
          className,
        )}
        {...props}
      />
    )
  }

  if (variant === "chart") {
    return (
      <div
        className={cn(
          "size-[180px] animate-pulse rounded-full bg-[var(--bg-hover)]",
          className,
        )}
        {...props}
      />
    )
  }

  // table-row variant
  return (
    <div className={cn("flex flex-col gap-[var(--space-2)]", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          data-slot="skeleton-row"
          className="h-[44px] w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-hover)]"
        />
      ))}
    </div>
  )
}

export { LoadingSkeleton }
export type { LoadingSkeletonProps }
