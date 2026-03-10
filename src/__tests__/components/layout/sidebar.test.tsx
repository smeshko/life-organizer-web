import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { FilterProvider, useFilter } from "@/contexts/filter-context"
import { Sidebar } from "@/components/layout/sidebar"

function renderSidebar(collapsed = false, initialRoute = "/transactions") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <FilterProvider>
        <Sidebar collapsed={collapsed} />
      </FilterProvider>
    </MemoryRouter>,
  )
}

function PeriodSetter({ period }: { period: "total" | number }) {
  const { setPeriod } = useFilter()
  React.useEffect(() => {
    setPeriod(period as Parameters<typeof setPeriod>[0])
  }, [period, setPeriod])
  return null
}

function renderSidebarWithPeriod(period: "total" | number) {
  return render(
    <MemoryRouter initialEntries={["/transactions"]}>
      <FilterProvider>
        <PeriodSetter period={period} />
        <Sidebar collapsed={false} />
      </FilterProvider>
    </MemoryRouter>,
  )
}

describe("Sidebar", () => {
  it("renders the logo text when expanded", () => {
    renderSidebar(false)
    expect(screen.getByText("Life Organizer")).toBeInTheDocument()
  })

  it("hides the logo text when collapsed", () => {
    renderSidebar(true)
    expect(screen.queryByText("Life Organizer")).not.toBeInTheDocument()
  })

  it("renders the sage green dot", () => {
    const { container } = renderSidebar()
    const dot = container.querySelector("span.rounded-full")
    expect(dot).toBeInTheDocument()
  })

  it("renders main navigation with aria-label", () => {
    renderSidebar()
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument()
  })

  it("renders all 4 nav links with correct labels", () => {
    renderSidebar()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
    expect(screen.getByText("Spending")).toBeInTheDocument()
    expect(screen.getByText("Budget")).toBeInTheDocument()
    expect(screen.getByText("Budget vs Actual")).toBeInTheDocument()
  })

  it("hides nav labels when collapsed", () => {
    renderSidebar(true)
    expect(screen.queryByText("Transactions")).not.toBeInTheDocument()
    expect(screen.queryByText("Spending")).not.toBeInTheDocument()
  })

  it("shows tooltips on collapsed nav items", () => {
    renderSidebar(true)
    const links = screen.getAllByRole("link")
    expect(links[0]).toHaveAttribute("title", "Transactions")
    expect(links[1]).toHaveAttribute("title", "Spending")
    expect(links[2]).toHaveAttribute("title", "Budget")
    expect(links[3]).toHaveAttribute("title", "Budget vs Actual")
  })

  it("does not show tooltips when expanded", () => {
    renderSidebar(false)
    const links = screen.getAllByRole("link")
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("title")
    })
  })

  it("applies active styling to current route link", () => {
    renderSidebar(false, "/transactions")
    const link = screen.getByText("Transactions").closest("a")
    expect(link?.className).toContain("income-bg-strong")
  })

  it("applies inactive styling to non-current route links", () => {
    renderSidebar(false, "/transactions")
    const link = screen.getByText("Spending").closest("a")
    expect(link?.className).toContain("text-secondary")
  })

  it("sets sidebar width to 240px when expanded", () => {
    const { container } = renderSidebar(false)
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "240px" })
  })

  it("sets sidebar width to 52px when collapsed", () => {
    const { container } = renderSidebar(true)
    const aside = container.querySelector("aside")
    expect(aside).toHaveStyle({ width: "52px" })
  })

  describe("Quick Stats", () => {
    it("renders dynamic glance header based on current month when expanded", () => {
      renderSidebar(false)
      const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
      ]
      const currentMonth = monthNames[new Date().getMonth()]
      expect(screen.getByText(`${currentMonth} AT A GLANCE`)).toBeInTheDocument()
    })

    it("renders all 4 stat amounts with hardcoded data", () => {
      renderSidebar(false)
      expect(screen.getByText("€4,250")).toBeInTheDocument()
      expect(screen.getByText("€2,847")).toBeInTheDocument()
      expect(screen.getByText("€850")).toBeInTheDocument()
      expect(screen.getByText("€553")).toBeInTheDocument()
    })

    it("renders stat labels", () => {
      renderSidebar(false)
      expect(screen.getByText("INCOME")).toBeInTheDocument()
      expect(screen.getByText("SPENT")).toBeInTheDocument()
      expect(screen.getByText("SAVED")).toBeInTheDocument()
      expect(screen.getByText("REMAINING")).toBeInTheDocument()
    })

    it("hides quick-stats when collapsed", () => {
      renderSidebar(true)
      expect(screen.queryByText(/AT A GLANCE/)).not.toBeInTheDocument()
      expect(screen.queryByText("€4,250")).not.toBeInTheDocument()
    })

    it("shows YEAR AT A GLANCE when period is total", () => {
      renderSidebarWithPeriod("total")
      expect(screen.getByText("YEAR AT A GLANCE")).toBeInTheDocument()
    })

    it("shows month name AT A GLANCE when period is a specific month", () => {
      renderSidebarWithPeriod(6)
      expect(screen.getByText("JUNE AT A GLANCE")).toBeInTheDocument()
    })
  })
})
