import { Header } from "@/components/layout/header"
import { SpendingCharts } from "@/features/spending/components/spending-charts"

export function SpendingPage() {
  return (
    <div>
      <Header title="Category Spending" />
      <SpendingCharts />
    </div>
  )
}
