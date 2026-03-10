import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router"
import { AppLayout } from "@/components/layout/app-layout"

function renderLayout(initialRoute = "/transactions") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="transactions"
            element={<div>Transactions Content</div>}
          />
          <Route path="budget" element={<div>Budget Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("AppLayout", () => {
  it("renders the sidebar", () => {
    renderLayout()
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument()
  })

  it("renders child route content via Outlet", () => {
    renderLayout()
    expect(screen.getByText("Transactions Content")).toBeInTheDocument()
  })

  it("applies max-width 1200px for non-budget routes", () => {
    renderLayout("/transactions")
    const content = screen.getByTestId("content-area")
    expect(content).toHaveStyle({ maxWidth: "1200px" })
  })

  it("removes max-width for /budget route", () => {
    renderLayout("/budget")
    const content = screen.getByTestId("content-area")
    expect(content).not.toHaveStyle({ maxWidth: "1200px" })
  })
})
