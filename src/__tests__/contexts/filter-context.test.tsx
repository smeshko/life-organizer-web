import { render, screen, act } from "@testing-library/react"
import { renderHook } from "@testing-library/react"
import { FilterProvider, useFilter } from "@/contexts/filter-context"

describe("FilterContext", () => {
  it("initializes with current year and current month", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    })

    const now = new Date()
    expect(result.current.selectedYear).toBe(now.getFullYear())
    expect(result.current.selectedPeriod).toBe(now.getMonth() + 1)
  })

  it("updates selectedYear when setYear is called", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    })

    act(() => {
      result.current.setYear(2025)
    })

    expect(result.current.selectedYear).toBe(2025)
  })

  it("updates selectedPeriod to a numeric month when setPeriod is called", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    })

    act(() => {
      result.current.setPeriod(6)
    })

    expect(result.current.selectedPeriod).toBe(6)
  })

  it("updates selectedPeriod to 'total' when setPeriod is called with 'total'", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    })

    act(() => {
      result.current.setPeriod("total")
    })

    expect(result.current.selectedPeriod).toBe("total")
  })

  it("throws error when useFilter is used outside FilterProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useFilter())
    }).toThrow("useFilter must be used within a FilterProvider")

    consoleSpy.mockRestore()
  })

  it("persists filter state across child re-renders", () => {
    function ChildComponent() {
      const { selectedYear, selectedPeriod } = useFilter()
      return (
        <div>
          <span data-testid="year">{selectedYear}</span>
          <span data-testid="period">{String(selectedPeriod)}</span>
        </div>
      )
    }

    const { rerender } = render(
      <FilterProvider>
        <ChildComponent />
      </FilterProvider>,
    )

    const now = new Date()
    expect(screen.getByTestId("year")).toHaveTextContent(
      String(now.getFullYear()),
    )
    expect(screen.getByTestId("period")).toHaveTextContent(
      String(now.getMonth() + 1),
    )

    // Re-render without changing state — values should persist
    rerender(
      <FilterProvider>
        <ChildComponent />
      </FilterProvider>,
    )

    expect(screen.getByTestId("year")).toHaveTextContent(
      String(now.getFullYear()),
    )
    expect(screen.getByTestId("period")).toHaveTextContent(
      String(now.getMonth() + 1),
    )
  })
})
