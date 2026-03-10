export interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-[var(--space-5)]">
      <h1 className="font-serif text-[32px] text-[var(--text-primary)]">
        {title}
      </h1>
      <div className="flex items-center gap-[var(--space-3)]">
        <select
          aria-label="Year"
          className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--text-primary)]"
          defaultValue="2026"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <select
          aria-label="Period"
          className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--text-primary)]"
          defaultValue="March"
        >
          <option value="March">March</option>
          <option value="February">February</option>
          <option value="January">January</option>
        </select>
      </div>
    </header>
  )
}
