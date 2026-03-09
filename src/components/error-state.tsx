import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
  onRetry?: () => void
}

function ErrorState({
  message,
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--warning-border)] bg-[var(--warning-bg)] p-[var(--space-4)]",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-[var(--text-primary)]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}

export { ErrorState }
export type { ErrorStateProps }
