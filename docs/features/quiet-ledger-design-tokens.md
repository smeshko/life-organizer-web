# Quiet Ledger Design Tokens & Project Scaffold

**Date:** 2026-03-09
**Related Files:** `src/index.css`, `index.html`, `src/main.tsx`, `src/components/theme-provider.tsx`, `components.json`, `vite.config.ts`

## Overview

The Life Organizer frontend is scaffolded with Vite 7 + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui. All visual identity is driven by the "Quiet Ledger" design token system — 184 CSS custom properties defined in `src/index.css` that cover surfaces, borders, text, semantic financial colors, chart palettes, shadows, radii, and spacing. Dark mode is the default theme.

## What Was Built

- Complete Vite + React 19 + TypeScript project scaffold via `npx shadcn@latest init --template vite`
- Quiet Ledger design token system with 184 CSS custom properties in `:root`
- shadcn/ui variable mappings that bridge design tokens to component library
- ThemeProvider with dark mode default, keyboard toggle (`d` key), and localStorage persistence
- Google Fonts integration: Instrument Serif (headings), DM Sans (body), DM Mono (code)
- Tailwind v4 CSS-first configuration via `@theme inline` directive (no `tailwind.config.js`)
- Vitest + Testing Library test infrastructure with smoke test
- Environment configuration with `.env.example`

## Technical Implementation

### Key Files

- `src/index.css`: All 184 Quiet Ledger CSS custom properties in `:root`, `.dark` class mappings for shadcn/ui, and `@theme inline` block for Tailwind v4
- `src/components/theme-provider.tsx`: React context-based theme provider with dark/light/system support, `d` key toggle, and cross-tab sync via `StorageEvent`
- `src/main.tsx`: App entry point wrapping `<App>` in `<ThemeProvider defaultTheme="dark">`
- `index.html`: Google Fonts preconnect + stylesheet links, `<html class="dark">`
- `components.json`: shadcn/ui configuration — `radix-nova` style, path aliases, Lucide icons
- `vite.config.ts`: Vite config with `@tailwindcss/vite` plugin and `@` path alias

### Key Patterns

- **Design Token Layering**: Quiet Ledger tokens (`--bg-root`, `--income-300`, etc.) are defined in `:root`. shadcn/ui variables (`--background`, `--primary`, etc.) reference the tokens via `var()`. Tailwind v4 maps to shadcn variables via `@theme inline`. This three-layer approach means changing a token value cascades through the entire UI.

- **Semantic Financial Colors**: Income (sage/eucalyptus), Expense (terracotta), Savings (copper), Warning (amber) each have a full scale (50–700) plus `bg`, `bg-strong`, and `border` opacity variants. Use these instead of raw colors for any financial data visualization.

- **Chart Palette**: `--chart-1` through `--chart-12` are ordered for doughnut/pie segments with maximum visual distinction. Use `var(--chart-N)` in Recharts components.

- **Tailwind v4 CSS-First Config**: No `tailwind.config.js` exists. All theme extensions are in the `@theme inline` block in `src/index.css`. To add new Tailwind utilities, add entries to this block.

### Code Examples

```tsx
// Using semantic financial colors in a component
<div className="bg-[var(--income-bg)] border border-[var(--income-border)] text-[var(--income-300)]">
  +$1,200.00
</div>

// Using surface tokens for card hierarchy
<div className="bg-[var(--bg-surface)]">       {/* Level 1 */}
  <div className="bg-[var(--bg-raised)]">      {/* Level 2 */}
    <div className="bg-[var(--bg-elevated)]">   {/* Level 3 */}
    </div>
  </div>
</div>

// Using chart colors with Recharts
<Cell fill="var(--chart-1)" />
<Cell fill="var(--chart-2)" />
```

## How to Use

1. **Add shadcn/ui components**: Run `npx shadcn@latest add [component]` — they will automatically inherit Quiet Ledger styling through the variable mappings
2. **Use semantic colors**: For financial data, always use `--income-*`, `--expense-*`, `--savings-*` tokens instead of arbitrary colors
3. **Surface hierarchy**: Use `--bg-root` → `--bg-surface` → `--bg-raised` → `--bg-elevated` for increasing elevation
4. **Typography**: `DM Sans` is the default body font. Use `font-serif` for `Instrument Serif` (headings) and `font-mono` for `DM Mono` (code/numbers)
5. **Extend Tailwind**: Add new theme values to the `@theme inline` block in `src/index.css`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `VITE_API_BASE_URL` | string | `http://localhost:8000/api` | Backend API base URL (see `.env.example`) |
| `ThemeProvider defaultTheme` | `"dark" \| "light" \| "system"` | `"dark"` | Default color scheme |
| `ThemeProvider storageKey` | string | `"theme"` | localStorage key for theme persistence |

## Notes

- Light mode tokens are deferred — only dark mode values are currently defined
- The `d` keyboard shortcut toggles dark/light mode (disabled in form inputs)
- shadcn/ui uses `radix-nova` style variant (configured in `components.json`)
- All radius tokens use the Quiet Ledger scale: `4px` (sm), `8px` (md), `12px` (lg)
