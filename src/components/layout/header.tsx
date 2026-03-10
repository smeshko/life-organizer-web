import { useFilter } from "@/contexts/filter-context"
import type { SelectedPeriod } from "@/contexts/filter-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface HeaderProps {
  title: string
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => currentYear - i)
}

function periodToString(period: SelectedPeriod): string {
  return String(period)
}

function stringToPeriod(value: string): SelectedPeriod {
  if (value === "total") return "total"
  return Number(value) as SelectedPeriod
}

const TRIGGER_CLASS =
  "font-sans text-[12px] font-medium bg-[var(--bg-elevated)] border-[var(--border-default)] rounded-[var(--radius-sm)]"

export function Header({ title }: HeaderProps) {
  const { selectedYear, selectedPeriod, setYear, setPeriod } = useFilter()

  return (
    <header className="flex items-center justify-between pb-[var(--space-5)]">
      <h1 className="font-serif text-[32px] text-[var(--text-primary)]">
        {title}
      </h1>
      <div className="flex items-center gap-[var(--space-3)]">
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger aria-label="Year" size="sm" className={TRIGGER_CLASS}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getYearOptions().map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={periodToString(selectedPeriod)}
          onValueChange={(value) => setPeriod(stringToPeriod(value))}
        >
          <SelectTrigger
            aria-label="Period"
            size="sm"
            className={TRIGGER_CLASS}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total Year</SelectItem>
            {MONTH_NAMES.map((name, index) => (
              <SelectItem key={index + 1} value={String(index + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
