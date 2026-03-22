import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { TransactionTypeFilter } from "@/features/transactions/hooks/use-transaction-filters"

export interface TransactionFiltersProps {
  type: TransactionTypeFilter
  categories: string[]
  dateFrom: string
  dateTo: string
  availableCategories: string[]
  onTypeChange: (type: TransactionTypeFilter) => void
  onCategoriesChange: (categories: string[]) => void
  onDateRangeChange: (from: string, to: string) => void
}

const TYPE_TABS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
  { value: "savings", label: "Savings" },
]

export function TransactionFilters({
  type,
  categories,
  dateFrom,
  dateTo,
  availableCategories,
  onTypeChange,
  onCategoriesChange,
  onDateRangeChange,
}: TransactionFiltersProps) {
  function handleCategoryToggle(category: string) {
    if (categories.includes(category)) {
      onCategoriesChange(categories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...categories, category])
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between sm:gap-[var(--space-4)]">
      {/* Type filter tab bar */}
      <div className="overflow-x-auto -mx-[var(--space-3)] px-[var(--space-3)] sm:mx-0 sm:px-0">
        <Tabs value={type} onValueChange={(v) => onTypeChange(v as TransactionTypeFilter)}>
          <TabsList
            className="h-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)]"
          >
            {TYPE_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-[11px] uppercase tracking-[1px] font-semibold px-[var(--space-3)] text-[var(--text-tertiary)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:bg-[var(--bg-active)]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
        {/* Category multi-select dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-[var(--space-2)] h-8 px-[var(--space-3)] text-[12px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {categories.length > 0 ? (
                <>
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] bg-[var(--bg-active)] text-[var(--text-primary)]"
                  >
                    {categories.length}
                  </Badge>
                  <span>
                    {categories.length === 1 ? "1 category" : `${categories.length} categories`}
                  </span>
                </>
              ) : (
                <span>Categories</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-0">
            <div className="max-h-60 overflow-y-auto p-2">
              {availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-[var(--space-2)] px-2 py-1.5 rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  <Checkbox
                    checked={categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
            {categories.length > 0 && (
              <div className="border-t border-[var(--border-subtle)] p-2">
                <button
                  type="button"
                  onClick={() => onCategoriesChange([])}
                  className="w-full text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] py-1 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Date range filter */}
        <div className="flex items-center gap-[var(--space-2)]">
          <label className="flex items-center gap-[var(--space-1)]">
            <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">
              From
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateRangeChange(e.target.value, dateTo)}
              className="h-8 px-[var(--space-2)] text-[12px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-400)]"
            />
          </label>
          <label className="flex items-center gap-[var(--space-1)]">
            <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">
              To
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateRangeChange(dateFrom, e.target.value)}
              className="h-8 px-[var(--space-2)] text-[12px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-sm)] text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-400)]"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
