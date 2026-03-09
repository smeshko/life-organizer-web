import { render } from "@testing-library/react"
import { LoadingSkeleton } from "@/components/loading-skeleton"

describe("LoadingSkeleton", () => {
  it("renders card variant with correct shape", () => {
    const { container } = render(<LoadingSkeleton variant="card" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass("animate-pulse")
    expect(skeleton).toHaveClass("h-24")
  })

  it("renders table-row variant with default count of 1", () => {
    const { container } = render(<LoadingSkeleton variant="table-row" />)
    const rows = container.querySelectorAll("[data-slot='skeleton-row']")
    expect(rows).toHaveLength(1)
  })

  it("renders table-row variant with specified count", () => {
    const { container } = render(
      <LoadingSkeleton variant="table-row" count={5} />,
    )
    const rows = container.querySelectorAll("[data-slot='skeleton-row']")
    expect(rows).toHaveLength(5)
  })

  it("renders chart variant as circle", () => {
    const { container } = render(<LoadingSkeleton variant="chart" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass("rounded-full")
    expect(skeleton).toHaveClass("animate-pulse")
  })

  it("all variants use bg-hover background", () => {
    const { container: cardContainer } = render(
      <LoadingSkeleton variant="card" />,
    )
    expect(cardContainer.firstChild).toHaveClass("bg-[var(--bg-hover)]")

    const { container: chartContainer } = render(
      <LoadingSkeleton variant="chart" />,
    )
    expect(chartContainer.firstChild).toHaveClass("bg-[var(--bg-hover)]")
  })
})
