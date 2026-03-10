import { ApiError } from "@/api/types"

describe("ApiError", () => {
  it("is an instance of Error", () => {
    const error = new ApiError(500, "Server error", { detail: "fail" })
    expect(error).toBeInstanceOf(Error)
  })

  it("has name set to ApiError", () => {
    const error = new ApiError(404, "Not found")
    expect(error.name).toBe("ApiError")
  })

  it("stores status, message, and body properties correctly", () => {
    const body = { detail: "Something went wrong" }
    const error = new ApiError(422, "Validation error", body)

    expect(error.status).toBe(422)
    expect(error.message).toBe("Validation error")
    expect(error.body).toBe(body)
  })

  it("defaults body to undefined when not provided", () => {
    const error = new ApiError(500, "Internal error")
    expect(error.body).toBeUndefined()
  })

  it("works with instanceof checks", () => {
    const error = new ApiError(400, "Bad request")

    expect(error instanceof ApiError).toBe(true)
    expect(error instanceof Error).toBe(true)
  })

  it("includes message in stack trace", () => {
    const error = new ApiError(500, "Server error")
    expect(error.stack).toContain("Server error")
  })
})
