function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-[var(--space-6)]">
      <div>
        <h2 className="font-serif text-[36px] text-[var(--text-primary)]">
          {title}
        </h2>
        {description && (
          <p className="mt-[var(--space-2)] text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

export function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] px-[var(--space-8)] py-[var(--space-12)]">
      <header className="mb-[var(--space-16)]">
        <h1 className="font-serif text-[48px] text-[var(--text-primary)]">
          Quiet Ledger Design System
        </h1>
        <p className="mt-[var(--space-2)] text-[var(--text-secondary)]">
          Visual reference for tokens, typography, and components
        </p>
      </header>

      <div className="space-y-[var(--space-16)]">
        <Section title="Surface Palette" description="Background and surface color tokens">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>

        <Section title="Semantic Colors" description="Income, Expenses, Savings, and Accent color groups">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>

        <Section title="Chart Palette" description="Ordered chart color sequence for data visualization">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>

        <Section title="Typography" description="Type scale and font families">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>

        <Section title="Spacing" description="Spacing scale tokens">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>

        <Section title="Components" description="Shared UI primitives and patterns">
          <p className="text-sm text-[var(--text-tertiary)]">Coming soon</p>
        </Section>
      </div>
    </div>
  )
}
