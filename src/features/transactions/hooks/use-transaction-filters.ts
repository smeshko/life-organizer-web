import { useCallback, useEffect, useMemo, useReducer, useRef } from "react"
import { useFilter } from "@/contexts/filter-context"
import type { SelectedPeriod } from "@/contexts/filter-context"
import type { Transaction } from "@/api/types"

export type TransactionTypeFilter = "all" | Transaction["type"]

interface FilterState {
  type: TransactionTypeFilter
  categories: string[]
  dateFrom: string
  dateTo: string
}

type FilterAction =
  | { type: "SET_TYPE"; payload: TransactionTypeFilter }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_DATE_RANGE"; payload: { from: string; to: string } }
  | { type: "RESET"; payload: { dateFrom: string; dateTo: string } }

function computeDateRange(
  year: number,
  period: SelectedPeriod,
): { dateFrom: string; dateTo: string } {
  if (period === "total") {
    return {
      dateFrom: `${year}-01-01`,
      dateTo: `${year}-12-31`,
    }
  }

  const month = String(period).padStart(2, "0")
  const lastDay = new Date(year, period, 0).getDate()
  return {
    dateFrom: `${year}-${month}-01`,
    dateTo: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  }
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload }
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "SET_DATE_RANGE":
      return { ...state, dateFrom: action.payload.from, dateTo: action.payload.to }
    case "RESET":
      return {
        type: "all",
        categories: [],
        dateFrom: action.payload.dateFrom,
        dateTo: action.payload.dateTo,
      }
    default:
      return state
  }
}

export function useTransactionFilters() {
  const { selectedYear, selectedPeriod } = useFilter()

  const defaultRange = useMemo(
    () => computeDateRange(selectedYear, selectedPeriod),
    [selectedYear, selectedPeriod],
  )

  const [state, dispatch] = useReducer(filterReducer, {
    type: "all",
    categories: [],
    dateFrom: defaultRange.dateFrom,
    dateTo: defaultRange.dateTo,
  })

  // Track whether this is the initial render
  const isInitialMount = useRef(true)

  // Reset filters when global year/period changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    dispatch({ type: "RESET", payload: defaultRange })
  }, [defaultRange])

  const setType = useCallback((type: TransactionTypeFilter) => {
    dispatch({ type: "SET_TYPE", payload: type })
  }, [])

  const setCategories = useCallback((categories: string[]) => {
    dispatch({ type: "SET_CATEGORIES", payload: categories })
  }, [])

  const setDateRange = useCallback((from: string, to: string) => {
    dispatch({ type: "SET_DATE_RANGE", payload: { from, to } })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET", payload: defaultRange })
  }, [defaultRange])

  return {
    type: state.type,
    categories: state.categories,
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    setType,
    setCategories,
    setDateRange,
    resetFilters,
  }
}
