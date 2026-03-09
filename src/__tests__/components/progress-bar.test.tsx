import { render } from "@testing-library/react"
import { ProgressBar } from "@/components/progress-bar"

describe("ProgressBar", () => {
  it("renders track and fill elements", () => {
    const { container } = render(<ProgressBar percentage={50} />)
    const track = container.firstChild as HTMLElement
    const fill = track.firstChild as HTMLElement
    expect(track).toBeInTheDocument()
    expect(fill).toBeInTheDocument()
  })

  it("uses sage color when percentage is below 80%", () => {
    const { container } = render(<ProgressBar percentage={50} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill).toHaveClass("bg-[var(--savings-400)]")
  })

  it("uses amber color when percentage is between 80% and 100%", () => {
    const { container } = render(<ProgressBar percentage={90} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill).toHaveClass("bg-[var(--income-400)]")
  })

  it("uses amber color at exactly 80%", () => {
    const { container } = render(<ProgressBar percentage={80} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill).toHaveClass("bg-[var(--income-400)]")
  })

  it("uses terracotta color when percentage exceeds 100%", () => {
    const { container } = render(<ProgressBar percentage={120} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill).toHaveClass("bg-[var(--expense-400)]")
  })

  it("visually caps fill width at 100%", () => {
    const { container } = render(<ProgressBar percentage={150} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill.style.width).toBe("100%")
  })

  it("sets correct width for normal percentage", () => {
    const { container } = render(<ProgressBar percentage={65} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill.style.width).toBe("65%")
  })

  it("handles 0% percentage", () => {
    const { container } = render(<ProgressBar percentage={0} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill.style.width).toBe("0%")
  })

  it("clamps negative percentage to 0%", () => {
    const { container } = render(<ProgressBar percentage={-10} />)
    const fill = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(fill.style.width).toBe("0%")
  })

  it("applies custom className to track", () => {
    const { container } = render(
      <ProgressBar percentage={50} className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass("custom-class")
  })
})
