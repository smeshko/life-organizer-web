/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

export type SelectedPeriod = "total" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type FilterState = {
  selectedYear: number
  selectedPeriod: SelectedPeriod
}

type FilterAction =
  | { type: "SET_YEAR"; payload: number }
  | { type: "SET_PERIOD"; payload: SelectedPeriod }

type FilterContextValue = FilterState & {
  setYear: (year: number) => void
  setPeriod: (period: SelectedPeriod) => void
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_YEAR":
      return { ...state, selectedYear: action.payload }
    case "SET_PERIOD":
      return { ...state, selectedPeriod: action.payload }
  }
}

const FilterContext = React.createContext<FilterContextValue | undefined>(
  undefined
)

function getDefaultState(): FilterState {
  const now = new Date()
  return {
    selectedYear: now.getFullYear(),
    selectedPeriod: (now.getMonth() + 1) as FilterState["selectedPeriod"],
  }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(filterReducer, undefined, getDefaultState)

  const value = React.useMemo<FilterContextValue>(
    () => ({
      selectedYear: state.selectedYear,
      selectedPeriod: state.selectedPeriod,
      setYear: (year: number) =>
        dispatch({ type: "SET_YEAR", payload: year }),
      setPeriod: (period: SelectedPeriod) =>
        dispatch({ type: "SET_PERIOD", payload: period }),
    }),
    [state.selectedYear, state.selectedPeriod]
  )

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  )
}

export function useFilter(): FilterContextValue {
  const context = React.useContext(FilterContext)

  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }

  return context
}
