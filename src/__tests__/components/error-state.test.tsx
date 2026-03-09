import { render, screen, fireEvent } from "@testing-library/react"
import { ErrorState } from "@/components/error-state"

describe("ErrorState", () => {
  it("renders error message", () => {
    render(<ErrorState message="Something went wrong" />)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorState message="Error" onRetry={() => {}} />)
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState message="Error" />)
    expect(
      screen.queryByRole("button", { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it("calls onRetry when retry button is clicked", () => {
    const handleRetry = vi.fn()
    render(<ErrorState message="Error" onRetry={handleRetry} />)
    fireEvent.click(screen.getByRole("button", { name: /retry/i }))
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it("applies warm yellow background styling", () => {
    const { container } = render(<ErrorState message="Error" />)
    const banner = container.firstChild as HTMLElement
    expect(banner).toHaveClass("bg-[var(--warning-bg)]")
    expect(banner).toHaveClass("border-[var(--warning-border)]")
  })
})
