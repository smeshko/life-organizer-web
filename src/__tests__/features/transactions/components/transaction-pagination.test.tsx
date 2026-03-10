import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TransactionPagination } from "@/features/transactions/components/transaction-pagination"

describe("TransactionPagination", () => {
  it("renders page info text", () => {
    render(
      <TransactionPagination page={2} totalPages={7} onPageChange={vi.fn()} />,
    )

    expect(screen.getByText("Page 2 of 7")).toBeInTheDocument()
  })

  it("renders Previous and Next buttons", () => {
    render(
      <TransactionPagination page={2} totalPages={7} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
  })

  it("disables Previous button on first page", () => {
    render(
      <TransactionPagination page={1} totalPages={7} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled()
  })

  it("disables Next button on last page", () => {
    render(
      <TransactionPagination page={7} totalPages={7} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled()
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled()
  })

  it("calls onPageChange with next page when Next is clicked", async () => {
    const onPageChange = vi.fn()
    render(
      <TransactionPagination page={2} totalPages={7} onPageChange={onPageChange} />,
    )

    await userEvent.click(screen.getByRole("button", { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("calls onPageChange with previous page when Previous is clicked", async () => {
    const onPageChange = vi.fn()
    render(
      <TransactionPagination page={3} totalPages={7} onPageChange={onPageChange} />,
    )

    await userEvent.click(screen.getByRole("button", { name: /previous/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("hides the entire component when totalPages <= 1", () => {
    const { container } = render(
      <TransactionPagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    )

    expect(container.firstChild).toBeNull()
  })
})
