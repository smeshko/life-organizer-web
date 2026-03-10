import { Button } from "@/components/ui/button"

interface TransactionPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TransactionPagination({ page, totalPages, onPageChange }: TransactionPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-[var(--space-4)] border-t border-[var(--border-subtle)] py-[var(--space-3)]">
      <Button
        variant="ghost"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </Button>
      <span className="text-sm text-[var(--text-secondary)]">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </Button>
    </div>
  )
}
