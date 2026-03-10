import { useRef, useState, useEffect, useCallback } from "react"
import { formatCurrency } from "@/lib/format"

export type NavigationDirection = "right" | "left" | "down" | "cancel"

interface BudgetCellProps {
  value: number
  category: string
  month: number
  type: "income" | "expense" | "savings"
  onSave: (value: number) => void
  onNavigate: (direction: NavigationDirection) => void
  editingCellId: string | null
  cellId: string
  onEditStart: (cellId: string) => void
}

function sanitizeNumericInput(raw: string): string {
  let result = ""
  let hasDot = false
  for (const ch of raw) {
    if (ch >= "0" && ch <= "9") {
      result += ch
    } else if (ch === "." && !hasDot) {
      result += ch
      hasDot = true
    }
  }
  return result
}

interface BudgetCellEditorProps {
  value: number
  onSave: (value: number) => void
  onNavigate: (direction: NavigationDirection) => void
}

function BudgetCellEditor({
  value,
  onSave,
  onNavigate,
}: BudgetCellEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const savedRef = useRef(false)
  const navigatedRef = useRef(false)
  const [inputValue, setInputValue] = useState(() =>
    value === 0 ? "" : String(value),
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }, [])

  const handleSave = useCallback(() => {
    if (savedRef.current) return
    savedRef.current = true
    const parsed = parseFloat(inputValue) || 0
    onSave(parsed)
  }, [inputValue, onSave])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      navigatedRef.current = true
      handleSave()
      onNavigate("down")
    } else if (e.key === "Tab") {
      e.preventDefault()
      navigatedRef.current = true
      handleSave()
      onNavigate(e.shiftKey ? "left" : "right")
    } else if (e.key === "Escape") {
      e.preventDefault()
      navigatedRef.current = true
      onNavigate("cancel")
    }
  }

  function handleBlur() {
    if (navigatedRef.current) return
    handleSave()
    onNavigate("cancel")
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(sanitizeNumericInput(e.target.value))
  }

  return (
    <td className="px-[var(--space-3)] py-[var(--space-2)]">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        role="textbox"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full bg-transparent text-right font-mono text-xs text-[var(--text-primary)] outline-none transition-shadow duration-100"
        style={{
          boxShadow: "0 0 0 1px var(--income-border)",
          borderRadius: "2px",
          padding: "2px 4px",
        }}
      />
    </td>
  )
}

export function BudgetCell({
  value,
  onSave,
  onNavigate,
  editingCellId,
  cellId,
  onEditStart,
}: BudgetCellProps) {
  const isEditing = editingCellId === cellId

  if (isEditing) {
    return (
      <BudgetCellEditor
        value={value}
        onSave={onSave}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <td
      className="cursor-pointer px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs text-[var(--text-secondary)] group-hover:outline group-hover:outline-1 group-hover:outline-[var(--border-default)]"
      onClick={() => onEditStart(cellId)}
    >
      {value === 0 ? "—" : formatCurrency(value)}
    </td>
  )
}
