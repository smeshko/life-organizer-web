import { describe, it, expect } from "vitest"
import { queryClient } from "@/lib/query-client"
import { QueryClient } from "@tanstack/react-query"

describe("queryClient", () => {
  it("exports a QueryClient instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it("has staleTime configured", () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBeGreaterThan(0)
  })

  it("has retry set to 1", () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.retry).toBe(1)
  })
})
