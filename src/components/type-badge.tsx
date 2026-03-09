import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typeBadgeVariants = cva(
  "inline-flex items-center border px-[8px] py-[2px] text-[11px] font-medium tracking-[0.3px] rounded-[var(--radius-sm)]",
  {
    variants: {
      variant: {
        income:
          "text-[var(--income-300)] bg-[var(--income-bg-strong)] border-[var(--income-border)]",
        expense:
          "text-[var(--expense-300)] bg-[var(--expense-bg-strong)] border-[var(--expense-border)]",
        savings:
          "text-[var(--savings-300)] bg-[var(--savings-bg-strong)] border-[var(--savings-border)]",
      },
    },
    defaultVariants: {
      variant: "income",
    },
  },
)

interface TypeBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof typeBadgeVariants> {}

function TypeBadge({ className, variant, children, ...props }: TypeBadgeProps) {
  return (
    <span className={cn(typeBadgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  )
}

export { TypeBadge, typeBadgeVariants }
