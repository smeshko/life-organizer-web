import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
}

function EmptyState({ message, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-[var(--space-12)]",
        className,
      )}
      {...props}
    >
      <p className="font-sans text-sm text-[var(--text-tertiary)]">
        {message}
      </p>
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
