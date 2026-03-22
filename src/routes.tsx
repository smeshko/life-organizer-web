import { BrowserRouter, Routes, Route, Navigate } from "react-router"

import { FilterProvider } from "@/contexts/filter-context"
import { AppLayout } from "@/components/layout/app-layout"
import { TransactionsPage } from "@/pages/transactions-page"
import { SpendingPage } from "@/features/spending/spending-page"
import { BudgetPage } from "@/pages/budget-page"
import { BudgetVsActualPage } from "@/pages/budget-vs-actual-page"
import { DesignSystemPage } from "@/pages/design-system-page"
import { BudgetExplorerPage } from "@/pages/budget-explorer-page"

export function AppRoutes() {
  return (
    <FilterProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/transactions" replace />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="spending" element={<SpendingPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="budget-vs-actual" element={<BudgetVsActualPage />} />
          <Route path="budget-explorer" element={<BudgetExplorerPage />} />
        </Route>
        <Route path="design-system" element={<DesignSystemPage />} />
      </Routes>
    </FilterProvider>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
