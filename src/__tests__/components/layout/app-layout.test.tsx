import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router"
import { FilterProvider } from "@/contexts/filter-context"
import { AppLayout } from "@/components/layout/app-layout"

function renderLayout(initialRoute = "/transactions") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <FilterProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path="transactions"
              element={<div>Transactions Content</div>}
            />
            <Route path="budget" element={<div>Budget Content</div>} />
          </Route>
        </Routes>
      </FilterProvider>
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

  it("collapses sidebar to 52px on /budget route", () => {
    const { container } = renderLayout("/budget")
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "52px" })
  })

  it("expands sidebar to 240px on non-budget routes", () => {
    const { container } = renderLayout("/transactions")
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "240px" })
  })

  it("hides quick-stats on /budget route", () => {
    renderLayout("/budget")
    expect(screen.queryByText(/AT A GLANCE/)).not.toBeInTheDocument()
  })

  it("shows quick-stats on non-budget routes", () => {
    renderLayout("/transactions")
    expect(screen.getByText(/AT A GLANCE/)).toBeInTheDocument()
  })
})
