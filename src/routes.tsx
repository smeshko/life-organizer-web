import { BrowserRouter, Routes, Route } from "react-router"

import App from "@/App"
import { DesignSystemPage } from "@/pages/design-system-page"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  )
}
