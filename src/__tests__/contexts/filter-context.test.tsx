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
    function ChildComponent({ extra }: { extra?: string }) {
      const { selectedYear, selectedPeriod, setYear } = useFilter()
      return (
        <div>
          <span data-testid="year">{selectedYear}</span>
          <span data-testid="period">{String(selectedPeriod)}</span>
          <button onClick={() => setYear(2025)}>Change Year</button>
          {extra && <span>{extra}</span>}
        </div>
      )
    }

    function Wrapper({ extra }: { extra?: string }) {
      return (
        <FilterProvider>
          <ChildComponent extra={extra} />
        </FilterProvider>
      )
    }

    const { rerender } = render(<Wrapper />)

    // Mutate state via the context
    act(() => {
      screen.getByText("Change Year").click()
    })

    expect(screen.getByTestId("year")).toHaveTextContent("2025")

    // Re-render the wrapper with a new prop — provider instance stays the same
    rerender(<Wrapper extra="re-rendered" />)

    // State should persist after re-render
    expect(screen.getByTestId("year")).toHaveTextContent("2025")
  })
})
