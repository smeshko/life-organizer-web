import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const THEME_OPTIONS = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
]

export function MobileHeader() {
  const { theme, setTheme } = useTheme()

  const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2]
  const next = THEME_OPTIONS[(THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length]

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-[var(--space-4)] py-[var(--space-3)] md:hidden">
      <div className="flex items-center gap-[var(--space-2)]">
        <span
          className="inline-block h-[8px] w-[8px] shrink-0 rounded-full"
          style={{ backgroundColor: "var(--income-300)" }}
        />
        <span className="font-serif text-[16px] text-[var(--text-primary)]">
          Life Organizer
        </span>
      </div>
      <button
        onClick={() => setTheme(next.value)}
        title={`Theme: ${current.label}`}
        className="flex items-center justify-center rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      >
        <current.icon size={16} />
      </button>
    </div>
  )
}
