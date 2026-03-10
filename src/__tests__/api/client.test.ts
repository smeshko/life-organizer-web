import { get, post, put, patch, del } from "@/api/client"
import { ApiError } from "@/api/types"

const BASE_URL = "http://localhost:8000/api"

function mockFetchResponse(body: unknown, status = 200, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response)
}

function mockFetchNetworkError() {
  return vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
}

function mockFetchMalformedJson(status = 200) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status,
    json: () => Promise.reject(new SyntaxError("Unexpected token")),
  } as unknown as Response)
}

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetchResponse({ success: true }))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("API Client", () => {
  describe("get()", () => {
    it("calls fetch with correct URL and GET method", async () => {
      await get("/users")

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users`,
        expect.objectContaining({ method: "GET" }),
      )
    })

    it("returns parsed JSON data", async () => {
      vi.stubGlobal("fetch", mockFetchResponse({ id: 1, name: "test" }))

      const result = await get<{ id: number; name: string }>("/users/1")

      expect(result).toEqual({ id: 1, name: "test" })
    })
  })

  describe("post()", () => {
    it("sends JSON body with POST method and Content-Type header", async () => {
      const body = { name: "test" }
      await post("/users", body)

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
    })
  })

  describe("put()", () => {
    it("sends JSON body with PUT method", async () => {
      const body = { name: "updated" }
      await put("/users/1", body)

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users/1`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(body),
        }),
      )
    })
  })

  describe("patch()", () => {
    it("sends JSON body with PATCH method", async () => {
      const body = { name: "patched" }
      await patch("/users/1", body)

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users/1`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      )
    })
  })

  describe("del()", () => {
    it("calls fetch with DELETE method", async () => {
      await del("/users/1")

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users/1`,
        expect.objectContaining({ method: "DELETE" }),
      )
    })
  })

  describe("base URL handling", () => {
    it("prepends base URL to paths", async () => {
      await get("/transactions")

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/transactions`,
        expect.any(Object),
      )
    })
  })

  describe("error handling", () => {
    it("throws ApiError with status and message for non-2xx responses", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetchResponse(
          { message: "Not found" },
          404,
          false,
        ),
      )

      await expect(get("/missing")).rejects.toThrow(ApiError)

      try {
        await get("/missing")
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(404)
        expect(apiError.message).toBe("Not found")
        expect(apiError.body).toEqual({ message: "Not found" })
      }
    })

    it("throws ApiError with fallback message when error body has no message", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "something" }),
        } as unknown as Response),
      )

      try {
        await get("/fail")
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(500)
        expect(typeof apiError.message).toBe("string")
      }
    })

    it("throws ApiError with status 0 for network failures", async () => {
      vi.stubGlobal("fetch", mockFetchNetworkError())

      try {
        await get("/offline")
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(0)
        expect(apiError.message).toBe(
          "Unable to connect to the server. Please check your connection and try again.",
        )
      }
    })

    it("throws ApiError for malformed JSON responses", async () => {
      vi.stubGlobal("fetch", mockFetchMalformedJson())

      try {
        await get("/malformed")
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.message).toBe(
          "Received an invalid response from the server.",
        )
      }
    })

    it("returns undefined for 204 No Content responses", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
        } as unknown as Response),
      )

      const result = await del("/users/1")

      expect(result).toBeUndefined()
    })

    it("returns undefined for 205 Reset Content responses", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 205,
        } as unknown as Response),
      )

      const result = await put("/users/1", { name: "reset" })

      expect(result).toBeUndefined()
    })

    it("handles non-2xx response with unparseable error body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 502,
          json: () => Promise.reject(new SyntaxError("Bad JSON")),
        } as unknown as Response),
      )

      try {
        await get("/bad-gateway")
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.status).toBe(502)
        expect(typeof apiError.message).toBe("string")
      }
    })
  })
})
